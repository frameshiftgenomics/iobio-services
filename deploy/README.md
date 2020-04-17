# Iobio Services Deployment

## Prerequisites

- [Docker](https://www.docker.com/)
- [Terraform](https://www.terraform.io/)
- [Packer](https://packer.io/)

## Setup

```bash
terraform init
```

## Build

```bash
docker-compose -f docker-compose-prod.yml build
docker-compose push
packer build iobio.json
```

## Deploy

```bash
terraform apply
```
