.PHONY: build
build:
	hugo --gc --minify

.PHONY: server
server:
	hugo server --bind 0.0.0.0

.PHONY: deploy
deploy:
	./scripts/deploy.sh
