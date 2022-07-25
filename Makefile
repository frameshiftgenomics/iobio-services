export DOCKER_BUILDKIT=1

GIT_TAG ?= $(shell git rev-parse --short HEAD)
ifeq ($(GIT_TAG),)
	GIT_TAG=latest
endif

GENE_IMG = udn.gene.iobio:${GIT_TAG}
GRU_IMG = udn.gru.iobio:${GIT_TAG}
DOCKERHUB_ORG ?= frameshiftgenomics
GENE_REPOSITORY = ${DOCKERHUB_ORG}/${GENE_IMG}
GRU_REPOSITORY = ${DOCKERHUB_ORG}/${GRU_IMG}

.PHONY: up
all: up
up:
	docker compose up

down:
	docker compose down

build-gene:
	docker build -t $(GENE_REPOSITORY) ./gene

build-gru:
	docker build -t $(GRU_REPOSITORY) -f ./gru/docker/prod/Dockerfile ./gru

push-gene-dockerhub:
	docker push $(GENE_REPOSITORY)

push-gru-dockerhub:
	docker push $(GRU_REPOSITORY)

deploy-traefik-stack:
	docker stack deploy -c ./docker/traefik-stack.yml traefik

deploy-iobio-stack:
	GRU_REPOSITORY=${GRU_REPOSITORY} GENE_REPOSITORY=${GENE_REPOSITORY} docker stack deploy -c ./docker/iobio-stack.yml iobio

check-services:
	docker service ls

destroy-traefik-stack:
	docker stack rm traefik

destroy-iobio-stack:
	docker stack rm iobio

prune-images:
	docker image prune -af
