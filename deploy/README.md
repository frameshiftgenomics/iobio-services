# Iobio Services Deployment

## Prerequisites

- [Docker](https://www.docker.com/)
- [Terraform](https://www.terraform.io/)
- [Packer](https://packer.io/)

## Setup

```dosini
terraform init
```

## Build

```dosini
docker-compose -f docker-compose-prod.yml build
docker-compose push
packer build iobio.json
```

## Deploy

```dosini
terraform apply
```
