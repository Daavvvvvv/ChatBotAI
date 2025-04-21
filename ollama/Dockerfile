FROM ollama/ollama:latest

# install curl for healthcheck
RUN apt-get update && apt-get install -y curl

# Create script directory
WORKDIR /scripts

# Add initialization script
COPY init-ollama.sh .
RUN sed -i 's/\r$//' init-ollama.sh && chmod +x init-ollama.sh

# Set entrypoint to our script
ENTRYPOINT ["/scripts/init-ollama.sh"]