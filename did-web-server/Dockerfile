FROM docker:cli

# Install necessary utilities
RUN apk add --no-cache bash coreutils

# Create necessary directories
RUN mkdir -p /run/dws/did_store

# Copy the start script
COPY start-server.sh /start-server.sh
RUN chmod +x /start-server.sh

# Set entrypoint to run the script
ENTRYPOINT ["/bin/bash", "/start-server.sh"]
