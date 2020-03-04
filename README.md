# iobio-services

Iobio services running in docker containers. Services include APIs and client applications.

[http://iobio.io/](http://iobio.io/)

[https://github.com/iobio](https://github.com/iobio)

### Services overview

| Service | Description | URL:PORT (on local machine) |
|---------|-------------|-----------------------------|
| gene | A client app for investigating potential disease-causing variants in real-time | [http://localhost:3000](http://localhost:3000) |
| gru | Iobio backend service | [http://localhost:9000](http://localhost:9000) |
| nginx | Reverse proxy to forward traffic to gene & encrpt traffic using letsencrypt. | N/A (does not run locally) |

```bash
# Check running docker services & ports:

docker ps
```

Not all iobio services are included in this repo, but other services could be added in the future.

### Local Development with Docker

Download Docker community edition and read the documentation:

[https://www.docker.com/get-started](https://www.docker.com/get-started)

```bash
# Check that docker has been installed correctly
docker --version

# Check that docker-compose has been installed correctly
docker-compose --version
```

The entire container stack is configured via `docker-compose`.  Docker compose will:

- bootstrap the containers
- set up the local network
- start the servers

```bash
# Start all services
docker-compose up
```

### Gene Overview

### Gru Overview

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
