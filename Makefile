help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
.PHONY: help

K8S_ENV ?= dev
APPLICATION_NAME ?= front
COMMIT ?= latest
BUILD ?= dev
REPO ?= opla/front
APP_VERSION=`jq -r .version <package.json`

build: ## builds docker image
	echo $(APP_VERSION)
	docker build \
		-t $(REPO):$(COMMIT) \
		--build-arg APP_VERSION=$(APP_VERSION) \
		--build-arg APP_BUILD=$(BUILD) \
		.

deploy: ## deploys to kubernetes
	(envsubst <k8s/values.yaml; envsubst <k8s/values.$(K8S_ENV).yaml) \
	| helm upgrade --install --wait --debug $(APPLICATION_NAME) ./k8s -f -

preview: ## preview the YAMLs that are about to get deployed to kubernetes
	make _prepare
	(envsubst <k8s/values.yaml; envsubst <k8s/values.$(K8S_ENV).yaml) \
	| helm template ./k8s -f -
	echo "release_name: $(APPLICATION_NAME)"
