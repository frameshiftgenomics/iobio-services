#!/bin/bash

# initialize new docker swarm
docker swarm init

# verify swarm mode is active
docker info


# Make file to hold TLS certs
mkdir letsencrypt
touch letsencrypt/acme.json
chmod 600 letsencrypt/acme.json


# Mount data cache
mkdir sqlite

sudo mount /dev/nvme1n1 sqlite/

sudo bash -c 'echo "/dev/nvme1n1 /home/ubuntu/sqlite ext4 defaults  0 2" >> /etc/fstab'

# Launch stacks
# launch reverse proxy
make deploy-traefik-stack

# launch iobio apps
make deploy-iobio-stack

# verify services
make check-services
