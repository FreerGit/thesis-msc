# Thesis - Decentralized Identifiers (DIDs)
Lorum ipsum etc

## ./scripts
Simple jobs such as submitting a DID document to solana devnet and updating it, see [README.md](./scripts/README.md)


## Current DIDs
issuer: did:sol:devnet:7e3bAN1vRNL7c73awhtwJpXmun5YwhCQffieGoi8vdsb

wallet: did:sol:devnet:E13rUS8is8BU2J7KYnnti4rrmZ6hFCKW6JF9F33QCKhT

## Considerations / Future work / TODOs
**Issue:** 
A issuer may use many variations of suites (Ed25519-2018, Ed25519-2020, jws-2020, x25519-2019, and so on..), currently we use one suite over the entire architecture. How should one handle N suites?

**Issue:**
Currently the Issuer uses the same keypair for the Solana account (DID) and for the signature itself for VCs. They should ideally be seperate, both for generality but also for the ability to do key rotations and key revocation.

