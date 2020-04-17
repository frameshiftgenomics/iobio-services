# Iobio Services Deployment

## Prerequisites

- [Docker](https://www.docker.com/)
- [Terraform](https://www.terraform.io/)
- [Packer](https://packer.io/)

## Setup

```console
terraform init
```

## Build

```console
docker-compose -f docker-compose-prod.yml build
docker-compose push
packer build iobio.json
```

## Deploy

```console
terraform apply
```
