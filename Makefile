help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
.PHONY: help

K8S_ENV ?= dev
APPLICATION_NAME ?= backend

build: ## builds docker image

deploy: ## deploys to kubernetes
	make _prepare
	(envsubst <k8s/values.yaml; envsubst <k8s/values.$(K8S_ENV).yaml) \
	| helm upgrade --install --debug $(APPLICATION_NAME) ./k8s $(HELM_XTRA_ARGS) -f -

preview: ## preview the YAMLs that are about to get deployed to kubernetes
	make _prepare
	(envsubst <k8s/values.yaml; envsubst <k8s/values.$(K8S_ENV).yaml) \
	| helm template ./k8s -f -
	echo "release_name: $(APPLICATION_NAME)"

_prepare:
	mkdir -p k8s/tmp/migrations/
	cp migrations/sqls/*.sql k8s/tmp/migrations/
