## Running in Production

There are numerous approaches to running docker workloads in the cloud:

- Kubernetes
- Managed container services in AWS, GCP, Azure, etc
- docker swarm
- docker run
- docker-compose

For simplicity and getting up and running quickly, a docker-compose file has been included to run in production. Additionally, docker-compose supports running containers with the `--privileged` flag, which is a requirement for the gru backend.

The following steps provide instructions to run the entire stack in the cloud.

### Architecture

All iobio applications run behind a reverse proxy called [traefik](https://docs.traefik.io/). Traefik acts as a stateless edge router that automatically routes traffic to the docker services. The docker services run on an internal docker bridge network, and are not accessible via the public internet. Traefik also handles TLS using Let's Encrypt to generate certificates that automatically renew.

### Services overview

| Service | Description | Host | Exposed Port |
|---------|-------------|----- | -------------|
| traefik | A reverse proxy to handle incoming web traffic, load balancing, and routing | https://traefik.frameshift.io | 80, 443 (public internet)|
| secure traefik dashboard | A services dashboard provided by traefik | https://traefik.frameshift.io | 80, 443 (public internet)|
| gene | A client app for investigating potential disease-causing variants in real-time | [https://gene.frameshift.io](https://gene.frameshift.io) | 80 (internal network) |
| gru | Iobio backend service | [https://gene.frameshift.io/api](https://gene.frameshift.io/api) | 9001 (internal network) |

### Boot up a machine

- Ubuntu is the recommended OS
- Machine will need a large root device volume ~120GB
- Once the machine is running, configure DNS records

Customize the infrasturcture to your liking.

### Install docker & docker-compose

```bash
# install docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
apt-get update
apt-cache policy docker-ce
apt-get install -y docker-ce

# install docker-compose
sudo curl -L "https://github.com/docker/compose/releases/download/1.25.4/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose

# add ubuntu user to docker group
usermod -aG docker ubuntu
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
├── gene2pheno
├── geneinfo
├── genomebuild
├── gnomad_header.txt
├── md5_reference_cache
├── references
└── vep-cache
```

### Launch

```bash
# launch in detached mode
docker-compose -f docker-compose-prod.yml up -d

# verify services
docker ps

# check service logs
docker container logs <container-name>
```

### Additional configuration

This guide is a starter guide to get you up and running quickly. There are many improvements that could be added.
