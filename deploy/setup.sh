#!/bin/bash

# Make sure ubuntu initializes, then install packages
sleep 30
sudo apt-get update

# install docker & make
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"

sudo apt-get update
sudo apt-cache policy docker-ce
sudo DEBIAN_FRONTEND=noninteractive apt-get install -y docker-ce
sudo DEBIAN_FRONTEND=noninteractive apt-get install make

# add ubuntu user to docker group
sudo usermod -aG docker ubuntu

sudo reboot