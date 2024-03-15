### Iobio Services Production Deployment with Docker Swarm

[https://docs.docker.com/engine/swarm/](https://docs.docker.com/engine/swarm/)

The following steps provide instructions to run the entire iobio stack in the cloud.

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
| gene | A client app for investigating potential disease-causing variants in real-time | [https://iobio.frameshift.io](https://iobio.frameshift.io) | 80 |
| gru | Iobio backend service | [https://iobio.frameshift.io/api](https://iobio.frameshift.io/api) | 9001 |

### Boot up a machine

- Ubuntu is the recommended OS
- Once the machine is running, configure DNS records (Two A records, one for gene.iobio and one for the traefik dashboard)

See the following notes for setting up AWS infrastructure:

[https://docs.docker.com/docker-for-aws/faqs/#recommended-vpc-and-subnet-setup](https://docs.docker.com/docker-for-aws/faqs/#recommended-vpc-and-subnet-setup)

A note on firewalls:

[https://docs.docker.com/engine/swarm/ingress/](https://docs.docker.com/engine/swarm/ingress/)

Customize the infrasturcture to your liking.

### Install docker

```bash
# Install docker-ce & make
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg lsb-release make

sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
sudo apt-get install -y docker-ce

# Add your user to the docker group (requires logout to take effect)
sudo groupadd docker
sudo usermod -aG docker ubuntu
```

### Configure Docker to use external DNS server (if needed)

Edit `/etc/docker/daemon.json`

```json
{
  "dns": ["8.8.8.8"]
}
```

```bash
# Restart docker service
sudo systemctl restart docker
```

### Initialize Docker swarm

```bash
# initialize a new swarm
docker swarm init

# verify swarm mode is active
docker info
```

### Clone repo (checkout appropriate branch if needed)

```bash
git clone https://github.com/frameshiftgenomics/iobio-services.git

cd iobio-services
```

### Create file to hold TLS certs

```bash
mkdir letsencrypt
touch letsencrypt/acme.json
chmod 600 letsencrypt/acme.json
```

### Verify sqlite cache volume is populated

The sqlite cache is available as an EBS snapshot. As of 3/15/24, the snapshot ID is `snap-0b2da72d101693ef7`.

1. Create a new EBS volume from the snapshot above
1. Attach the volume to the EC2 instance via the AWS console
1. Create the sqlite directory and mount the volume to that directory (similar to the steps below but see the link for more detailed instructions)

```bash
mkdir sqlite

sudo mount /dev/xvdf sqlite/
```

[https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ebs-using-volumes.html](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ebs-using-volumes.html)

```
sqlite/
├── CHANGELOG.md
├── VERSION
├── data
├── gene2pheno
├── geneinfo
├── genomebuild
├── gnomad
├── gnomad_header.txt
├── hpo
├── lost+found
├── md5_reference_cache
├── references
└── vep-cache
```

### Final Directory Structure

The final directory structure should look like this:

```
├── LICENSE
├── Makefile
├── README.md
├── docker
├── docker-compose.yml
├── docs
├── gene
├── gru
├── letsencrypt
└── sqlite
```

### Launch stacks

```bash
# launch reverse proxy
make deploy-traefik-stack

# launch iobio apps
make deploy-iobio-stack

# verify services
make check-services

# check service logs
docker service logs <service-name>
```

### Additional configuration

This guide is a starter guide to get you up and running quickly. There are many improvements that should be added including but not limited to:

- additional nodes to the docker swarm cluster for added redundency
- distributed logging
- distributed volumes
- swarm management & maintenance
