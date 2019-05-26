.PHONY: build
build:
	hugo

.PHONY: server
server:
	hugo server

.PHONY: deploy
deploy:
	./scripts/deploy.sh
