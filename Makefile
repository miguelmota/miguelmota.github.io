.PHONY: build
build:
	hugo --minify

.PHONY: server
server:
	hugo server

.PHONY: deploy
deploy:
	./scripts/deploy.sh
