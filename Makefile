# Project variables
PROJECT_NAME ?= wire
ORG_NAME ?= bench-projects
REPO_NAME ?= wire-api

# File names
DOCKER_DEV_COMPOSE_FILE := docker/dev/docker-compose.yaml

DOCKER_REGISTRY ?= gcr.io

.PHONY: help


## Show help
help:
	@echo ''
	@echo 'Usage:'
	@echo '${YELLOW} make ${RESET} ${GREEN}<target> [options]${RESET}'
	@echo ''
	@echo 'Targets:'
	@awk '/^[a-zA-Z\-\_0-9]+:/ { \
		message = match(lastLine, /^## (.*)/); \
		if (message) { \
			command = substr($$1, 0, index($$1, ":")-1); \
			message = substr(lastLine, RSTART + 3, RLENGTH); \
			printf "  ${YELLOW}%-$(TARGET_MAX_CHAR_NUM)s${RESET} %s\n", command, message; \
		} \
	} \
	{ lastLine = $$0 }' $(MAKEFILE_LIST)
	@echo ''


## Generate .env file from the provided sample
env_file:
	@ printenv > .env
	@ echo " "



## build the docker images
build:env_file
	${INFO} "Building docker images..."
	@ echo " "
	@ docker-compose -f $(DOCKER_DEV_COMPOSE_FILE) build
	@ ${INFO} "Build Completed successfully"



## Start the development environment containers
start:env_file
	${INFO} "Spinning up your development environment..."
	@ echo " "
	@ docker-compose -f $(DOCKER_DEV_COMPOSE_FILE) up -d
	@ ${INFO} "Your development environment is now ready"

## Stop development containers
stop:
	${INFO} "Stopping your development environment containers..."
	@ docker-compose -f $(DOCKER_DEV_COMPOSE_FILE) down -v
	${INFO} "All containers stopped successfully"


# extract ssh arguments

ifeq (ssh,$(firstword $(MAKECMDGOALS)))
  SSH_ARGS := $(word 2, $(MAKECMDGOALS))
  ifeq ($(SSH_ARGS),)
    $(error You must specify a service)
  endif
  $(eval $(SSH_ARGS):;@:)
endif

# extract ssh arguments

ifeq (tag,$(firstword $(MAKECMDGOALS)))
  TAG_ARGS := $(word 2, $(MAKECMDGOALS))
  ifeq ($(TAG_ARGS),)
    $(error You must specify a tag)
  endif
  $(eval $(TAG_ARGS):;@:)
endif


  # COLORS
GREEN  := $(shell tput -Txterm setaf 2)
YELLOW := $(shell tput -Txterm setaf 3)
WHITE  := $(shell tput -Txterm setaf 7)
NC := "\e[0m"
RESET  := $(shell tput -Txterm sgr0)
# Shell Functions
INFO := @bash -c 'printf $(YELLOW); echo "===> $$1"; printf $(NC)' SOME_VALUE
SUCCESS := @bash -c 'printf $(GREEN); echo "===> $$1"; printf $(NC)' SOME_VALUE
# check and inspect Logic

INSPECT := $$(docker-compose -p $$1 -f $$2 ps -q $$3 | xargs -I ARGS docker inspect -f "{{ .State.ExitCode }}" ARGS)

CHECK := @bash -c 'if [[ $(INSPECT) -ne 0 ]]; then exit $(INSPECT); fi' VALUE

APP_CONTAINER_ID := $$(docker-compose -p $(DOCKER_REL_PROJECT) -f $(DOCKER_REL_COMPOSE_FILE) ps -q $(APP_SERVICE_NAME))

IMAGE_ID := $$(docker inspect -f '{{ .Image }}' $(APP_CONTAINER_ID))


# Introspect repository tags
REPO_EXPR := $$(docker inspect -f '{{range .RepoTags}}{{.}} {{end}}' $(IMAGE_ID) | grep -oh "$(REPO_FILTER)" | xargs)
