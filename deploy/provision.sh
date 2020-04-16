#!/bin/bash

# Make sure ubuntu initializes, then install packages
sleep 30
sudo apt-get update
sudo DEBIAN_FRONTEND=noninteractive apt-get install -y \
  awscli \
  apt-transport-https \
  ca-certificates \
  curl \
  gnupg-agent \
  software-properties-common

# Add Docker’s official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

# Set up Docker's stable repository
sudo add-apt-repository \
  "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) \
  stable"

# Install the latest version of Docker Engine and containerd
sudo apt-get update
sudo DEBIAN_FRONTEND=noninteractive apt-get install -y docker-ce docker-ce-cli containerd.io

# Download the current stable release of Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/1.25.4/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Apply executable permissions to the binary
sudo chmod +x /usr/local/bin/docker-compose

# Populate the data directory
aws s3 sync s3://nebula-iobio-services sqlite

# Pull our latest docker service and start it
# The build directory needs to exist, even if we aren't building...
mkdir gene gru
sudo docker-compose pull
sudo docker-compose up -d
