#!/bin/bash

# Start Ollama in the background
ollama serve &
OLLAMA_PID=$!

# Wait for Ollama server to be ready
echo "Waiting for Ollama to start..."
until curl -s http://localhost:11434/api/tags > /dev/null 2>&1; do
  sleep 1
  echo "Waiting for Ollama API..."
done

echo "Ollama API is available. Checking for models..."

# Function to check if model exists
model_exists() {
  curl -s http://localhost:11434/api/tags | grep -q "\"$1\""
  return $?
}

# Pull models if they don't exist
if ! model_exists "deepseek-r1:7b"; then
  echo "Pulling deepseek-r1:7b model..."
  ollama pull deepseek-r1:7b
else
  echo "Model deepseek-r1:7b already exists."
fi

if ! model_exists "qwen2.5:3b"; then
  echo "Pulling qwen2.5:3b model..."
  ollama pull qwen2.5:3b
else
  echo "Model qwen2.5:3b already exists."
fi

echo "Models ready!"

# Wait for the Ollama process to finish
wait $OLLAMA_PID