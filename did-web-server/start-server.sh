#!/bin/bash

# Generate the key (owner.jwk)
echo "Generating owner.jwk..."
docker run --rm identinet/didkit-cli:0.3.2-5 key generate ed25519 > owner.jwk

# Derive the DID from the key (owner.did)
echo "Generating owner.did from owner.jwk..."
docker run --rm -u "$(id -u):$(id -g)" -v "$PWD:/run/didkit" identinet/didkit-cli:0.3.2-5 key to did -k owner.jwk | tee owner.did

# Extract the DID from the generated output (owner.did)
DID_OWNER=$(cat owner.did)

# Create .env configuration file
echo "Creating .env file..."
cat > .env <<EOF
# Set the created DID for the owner
DWS_OWNER=$DID_OWNER
DWS_ADDRESS=::
DWS_EXTERNAL_HOSTNAME=localhost
DWS_BACKEND=file
DWS_BACKEND_FILE_STORE=/run/dws/did_store
DWS_LOG_LEVEL=normal 
EOF

# Start the CORS proxy
sudo nginx -s reload -c $(pwd)/nginx.conf

# Start the did-web-server with the generated configuration
echo "Starting the did-web-server..."
docker run -it --name did-web-server -p 8000:8000 --env-file .env -u "$(id -u):$(id -g)" -v "$PWD:/run/dws" identinet/did-web-server

echo "DID Web Server running at: http://localhost:8000"
echo "CORS-enabled Proxy running at: http://localhost:8080"