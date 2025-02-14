#!/bin/bash

# Configurations
DWS_EXTERNAL_HOSTNAME=${DWS_EXTERNAL_HOSTNAME:-"localhost"}  # Server hostname (default: localhost)
OWNER_DID_FILE="owner.did"
OWNER_JWK_FILE="owner.jwk"
DID_KEY_PREFIX="alexander"

# Generate a new key pair for the DID
generate_key_pair() {
  echo "Generating a new key pair for $DID_KEY_PREFIX..."
  docker run --rm identinet/didkit-cli:latest key generate ed25519 > "$DID_KEY_PREFIX.jwk"
}

# Create the DID document
create_did_document() {
  echo "Creating DID document for $DID_KEY_PREFIX..."
  cat > "$DID_KEY_PREFIX-did.json" <<EOF
{
  "@context": [
    "https://www.w3.org/ns/did/v1",
    "https://w3id.org/security/suites/jws-2020/v1"
  ],
  "id": "did:web:${DWS_EXTERNAL_HOSTNAME}%3A8000:${DID_KEY_PREFIX}",
  "verificationMethod": [
    {
      "id": "did:web:${DWS_EXTERNAL_HOSTNAME}%3A8000:${DID_KEY_PREFIX}#key1",
      "type": "JsonWebKey2020",
      "controller": "did:web:${DWS_EXTERNAL_HOSTNAME}%3A8000:${DID_KEY_PREFIX}",
      "publicKeyJwk": {
        "kty": "OKP",
        "crv": "Ed25519",
        "x": "$(jq -r .x $DID_KEY_PREFIX.jwk)"
      }
    }
  ],
  "authentication": ["did:web:${DWS_EXTERNAL_HOSTNAME}%3A8000:${DID_KEY_PREFIX}#key1"],
  "assertionMethod": ["did:web:${DWS_EXTERNAL_HOSTNAME}%3A8000:${DID_KEY_PREFIX}#key1"]
}
EOF
}

# Create the Verifiable Credential (VC) that contains the DID document
create_verifiable_credential() {
  echo "Creating Verifiable Credential (VC) for $DID_KEY_PREFIX..."
  cat > "$DID_KEY_PREFIX-vc-did.json" <<EOF
{
  "@context": [
    "https://www.w3.org/2018/credentials/v1"
  ],
  "id": "uuid:$(uuidgen)",
  "type": ["VerifiableCredential"],
  "issuer": "$(cat $OWNER_DID_FILE)",
  "issuanceDate": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "credentialSubject": $(cat $DID_KEY_PREFIX-did.json)
}
EOF
}

# Sign the Verifiable Credential (VC)
sign_verifiable_credential() {
  echo "Signing Verifiable Credential (VC) for $DID_KEY_PREFIX..."
  VERIFICATION_METHOD="$(docker run --rm --network=host identinet/didkit-cli:latest did resolve "$(cat $OWNER_DID_FILE)" | jq -r '.assertionMethod[0]')"
  docker run -i --rm -u "$(id -u):$(id -g)" -v "$PWD:/run/didkit" --network=host identinet/didkit-cli:latest credential issue \
    -k $OWNER_JWK_FILE -p assertionMethod -t Ed25519Signature2018 -v "$VERIFICATION_METHOD" < $DID_KEY_PREFIX-vc-did.json > $DID_KEY_PREFIX-vc-did-signed.json
}

# Create Verifiable Presentation (VP)
create_verifiable_presentation() {
  echo "Creating Verifiable Presentation (VP) for $DID_KEY_PREFIX..."
  curl --fail-with-body -o $DID_KEY_PREFIX-vp-proof-parameters.json http://${DWS_EXTERNAL_HOSTNAME}:8000/${DID_KEY_PREFIX}/did.json?proofParameters
  
  cat > $DID_KEY_PREFIX-vp.json <<EOF
{
  "@context": "https://www.w3.org/2018/credentials/v1",
  "type": ["VerifiablePresentation"],
  "holder": "$(cat $OWNER_DID_FILE)",
  "verifiableCredential": $(cat $DID_KEY_PREFIX-vc-did-signed.json)
}
EOF
}

# Sign the Verifiable Presentation (VP)
sign_verifiable_presentation() {
  echo "Signing Verifiable Presentation (VP) for $DID_KEY_PREFIX..."
  VERIFICATION_METHOD="$(docker run --rm --network=host identinet/didkit-cli:latest did resolve "$(cat $OWNER_DID_FILE)" | jq -r '.assertionMethod[0]')"
  DOMAIN="$(jq -r .domain $DID_KEY_PREFIX-vp-proof-parameters.json)"
  CHALLENGE="$(jq -r .challenge $DID_KEY_PREFIX-vp-proof-parameters.json)"
  PROOF_PURPOSE="$(jq -r .proof_purpose $DID_KEY_PREFIX-vp-proof-parameters.json)"
  echo "jq:"
  jq . $DID_KEY_PREFIX-vp-proof-parameters.json 

  docker run -i --rm -u "$(id -u):$(id -g)" -v "$PWD:/run/didkit" --network=host identinet/didkit-cli:latest presentation issue \
    -k $OWNER_JWK_FILE -p "$PROOF_PURPOSE" -t Ed25519Signature2018 -v "$VERIFICATION_METHOD" -d "$DOMAIN" -C "$CHALLENGE" \
    < $DID_KEY_PREFIX-vp.json > $DID_KEY_PREFIX-vp-signed.json
}

# Register the DID on the server
register_did_on_server() {
  echo "Registering DID on server..."
  echo "http://${DWS_EXTERNAL_HOSTNAME}:8000/${DID_KEY_PREFIX}/did.json"
  curl --fail-with-body -X POST -d @$DID_KEY_PREFIX-vp-signed.json http://${DWS_EXTERNAL_HOSTNAME}:8000/${DID_KEY_PREFIX}/did.json
}

# Cleanup function to remove temporary files
cleanup() {
  echo "Cleaning up temporary files..."
  rm -f "$DID_KEY_PREFIX.jwk" "$DID_KEY_PREFIX-did.json" "$DID_KEY_PREFIX-vc-did.json" "$DID_KEY_PREFIX-vc-did-signed.json" "$DID_KEY_PREFIX-vp-proof-parameters.json" "$DID_KEY_PREFIX-vp.json" "$DID_KEY_PREFIX-vp-signed.json"
}

# Main Function
register_new_did() {
  generate_key_pair
  create_did_document
  create_verifiable_credential
  sign_verifiable_credential
  create_verifiable_presentation
  sign_verifiable_presentation
  register_did_on_server
  cleanup
  echo "DID $DID_KEY_PREFIX successfully registered!"
}

# Execute the main function to register a new DID
register_new_did
