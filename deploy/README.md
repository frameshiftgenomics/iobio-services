# Iobio Services Deployment

## Prerequisites

- [Docker](https://www.docker.com/)
- [Terraform](https://www.terraform.io/)
- [Packer](https://packer.io/)
- [Make](https://www.gnu.org/software/make/manual/make.html)

## Setup

```bash
terraform init
```

## Build

```bash
# build gene, gru
make build-gene
make build-gru

# push image to dockerhub for both gene, gru
make push-gene-dockerhub
make push-gru-dockerhub

# build AMI using packer from both images
packer build iobio.json
```

## Deploy

```bash
terraform apply
```
