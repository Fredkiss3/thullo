domain := $(DEPLOY_DOMAIN)
server := "$(DEPLOY_USER)@$(domain)"
dir := "$(DEPLOY_DIR)"

.DEFAULT_GOAL := help
help: ### Show this help message
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

.PHONY: build-local
build-local: ### Build docker image locally
	docker buildx build --platform linux/amd64 -t dcr.fredkiss.dev/thullo-api . \
		--build-arg MONGO_URI=$(MONGO_URI) \
		--build-arg ISSUER_BASE_URL=$(ISSUER_BASE_URL) \
		--build-arg OAUTH_CLIENT_ID=$(OAUTH_CLIENT_ID) \
		--build-arg OAUTH_REDIRECT_URI=$(OAUTH_REDIRECT_URI) \
		--build-arg UNSPLASH_API_KEY=$(UNSPLASH_API_KEY) \
		--build-arg OAUTH_CLIENT_SECRET=$(OAUTH_CLIENT_SECRET) \
		--build-arg JWT_SECRET=$(JWT_SECRET) \
		--build-arg CLOUDINARY_URL=$(CLOUDINARY_URL)  \
		--build-arg CLOUDINARY_ASSET_URL=$(CLOUDINARY_ASSET_URL) 

.PHONY: build-docker
build-docker: ### Build docker image
	docker build -t dcr.fredkiss.dev/thullo-api . \
		--build-arg MONGO_URI=$(MONGO_URI) \
		--build-arg ISSUER_BASE_URL=$(ISSUER_BASE_URL) \
		--build-arg OAUTH_CLIENT_ID=$(OAUTH_CLIENT_ID) \
		--build-arg OAUTH_REDIRECT_URI=$(OAUTH_REDIRECT_URI) \
		--build-arg UNSPLASH_API_KEY=$(UNSPLASH_API_KEY) \
		--build-arg OAUTH_CLIENT_SECRET=$(OAUTH_CLIENT_SECRET) \
		--build-arg JWT_SECRET=$(JWT_SECRET) \
		--build-arg CLOUDINARY_URL=$(CLOUDINARY_URL)  \
		--build-arg CLOUDINARY_ASSET_URL=$(CLOUDINARY_ASSET_URL) 

.PHONY: login-docker
login-docker: ### login to docker registry
	echo $(DCR_PASSWD) | docker login  --username=$(DCR_USER) --password-stdin dcr.fredkiss.dev

.PHONY: push-docker
push-docker: ### Push docker image to registry
	docker push dcr.fredkiss.dev/thullo-api

.PHONY: deploy-api
deploy-api: ### deploy docker image for the api
	ssh -p $(DEPLOY_PORT) $(server) "echo $(DCR_PASSWD) | docker login  --username=$(DCR_USER) --password-stdin dcr.fredkiss.dev && docker pull dcr.fredkiss.dev/thullo-api && docker stop thullo-api | docker rm thullo-api | docker run -d --network caddy --restart=always --name thullo-api dcr.fredkiss.dev/thullo-api"

.PHONY: deploy-front
deploy-front: ### deploy docker image for the front
	ssh -p $(DEPLOY_PORT) $(server) "echo $(DCR_PASSWD) | docker login  --username=$(DCR_USER) --password-stdin dcr.fredkiss.dev && docker pull dcr.fredkiss.dev/thullo-front && docker stop thullo-front | docker rm thullo-front | docker run -d --network caddy --restart=always --name thullo-front dcr.fredkiss.dev/thullo-front"


