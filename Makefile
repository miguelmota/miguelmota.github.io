.PHONY: build
build:
	hugo --gc --minify

.PHONY: serve
serve:
	hugo server --bind 0.0.0.0

.PHONY: deploy
deploy:
	./scripts/deploy.sh
