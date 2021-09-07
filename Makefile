# Enable BuildKit, a next generation container image builder:
# https://docs.docker.com/develop/develop-images/build_enhancements/#to-enable-buildkit-builds
export DOCKER_BUILDKIT=1

GIT_TAG ?= $(shell git rev-parse --short HEAD)
ifeq ($(GIT_TAG),)
	GIT_TAG=latest
endif

GENE_IMG = gene.iobio:${GIT_TAG}
GRU_IMG = gru.iobio:${GIT_TAG}
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

prune-images:
	docker image prune -af
