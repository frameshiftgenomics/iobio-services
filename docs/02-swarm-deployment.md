## This deployment is not yet supported!

The intended deployment for the iobio stack was originally docker swarm.

However, the gru backend container needs to run with the `--privileged` flag (because it runs singularity). Therefore, the production deployment was changed to docker-compose. Docker-compose is intended for local development, and does not have all of the features of docker swarm (e.g. clustering, overlay networks, etc).

If singularity is removed from gru, or the `--privileged` option becomes available to swarm services, then this deployment would become a viable option!

For more info:

- [https://github.com/moby/moby/issues/25303](https://github.com/moby/moby/issues/25303)
- [https://github.com/docker/swarmkit/pull/1722](https://github.com/docker/swarmkit/pull/1722)
- [https://github.com/docker/swarmkit/issues/1030](https://github.com/docker/swarmkit/issues/1030)

### Docker Swarm

[https://docs.docker.com/engine/swarm/](https://docs.docker.com/engine/swarm/)

The following steps provide instructions to run the entire stack in the cloud.

### Stack architecture

All iobio applications run behind a reverse proxy called [traefik](https://docs.traefik.io/). Traefik acts as a stateless edge router that automatically routes traffic to the docker services. The docker services run on an internal docker swarm overlay network, and are not accessible via the public internet. Traefik also handles TLS using Let's Encrypt to generate certificates that automatically renew.

### Traefik stack overview

| Service | Description | Host | Exposed Port (to public internet) |
|---------|-------------|----- | -------------|
| traefik | A reverse proxy to handle incoming web traffic, load balancing, and routing | https://traefik.frameshift.io | 80, 443 |
| secure traefik dashboard | A services dashboard provided by traefik | https://traefik.frameshift.io | 80, 443 |

### Iobio stack overview

| Service | Description | Host | Exposed Port (on proxy network) |
|---------|-------------|----- | -------------|
| gene | A client app for investigating potential disease-causing variants in real-time | [https://gene.frameshift.io](https://gene.frameshift.io) | 80 |
| gru | Iobio backend service | [https://gene.frameshift.io/api](https://gene.frameshift.io/api) | 9001 |

### Boot up a machine

- Ubuntu is the recommended OS
- Machine will need a large root device volume ~120GB
- Once the machine is running, configure DNS records

See the following notes for setting up AWS infrastructure:

[https://docs.docker.com/docker-for-aws/faqs/#recommended-vpc-and-subnet-setup](https://docs.docker.com/docker-for-aws/faqs/#recommended-vpc-and-subnet-setup)

A note on firewalls:

[https://docs.docker.com/engine/swarm/ingress/](https://docs.docker.com/engine/swarm/ingress/)

Customize the infrasturcture to your liking.

### Install docker

```bash
# install docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
apt-get update
apt-cache policy docker-ce
apt-get install -y docker-ce

# add ubuntu user to docker group
usermod -aG docker ubuntu
```

### Initialize Docker swarm

```bash
# initialize a new swarm
docker swarm init

# verify swarm mode
docker info
```

### Make file to hold TLS certs

```bash
mkdir letsencrypt
touch letsencrypt/acme.json
chmod 600 letsencrypt/acme.json
```

### Verify data volume is populated

```
sqlite/data/
├── data
├── gene2pheno
├── geneinfo
├── genomebuild
├── gnomad_header.txt
├── md5_reference_cache
├── references
└── vep-cache
```

### Launch stacks

```bash
# launch reverse proxy
docker stack deploy -c docker/traefik-stack.yml traefik
# launch iobio apps
docker stack deploy -c docker/iobio-stack.yml iobio

# verify services
docker service ls

# check service logs
docker service logs <service-name>
```

### Additional configuration

This guide is a starter guide to get you up and running quickly. There are many improvements that should be added including but not limited to:

- additional nodes to the docker swarm cluster for added redundency
- distributed logging
- distributed volumes
- swarm management & maintenance
