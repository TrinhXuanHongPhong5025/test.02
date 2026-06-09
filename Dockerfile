FROM mcr.microsoft.com/devcontainers/javascript-node:0-18

# Install basic development tools
RUN apt-get update && apt-get install -y default-mysql-client && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /workspace
