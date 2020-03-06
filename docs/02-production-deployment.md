### Running in Production

There are numerous approaches to running docker workloads in the cloud:

- Kubernetes
- Managed container services in AWS, GCP, Azure, etc
- docker swarm
- docker run

For simplicity and getting up and running quickly, a docker stack is included to be run on docker swarm.

### Docker Swarm

[https://docs.docker.com/engine/swarm/](https://docs.docker.com/engine/swarm/)

The following steps provide instructions to run the entire stack in the cloud on a single machine:

1. Boot up a machine using any cloud provider. We'll use an ubuntu machine.
2. Install docker

```bash
# install docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
apt-get update
apt-cache policy docker-ce
apt-get install -y docker-ce

# install docker compose
curl -L "https://github.com/docker/compose/releases/download/1.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose

# add ubuntu user to docker group
usermod -aG docker ubuntu
```

3. Initialize docker swarm

```bash
# initialize a new swarm
docker swarm init

# verify swarm mode
docker info
```

4. Build all containers

5. Launch stack
