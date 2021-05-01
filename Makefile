.PHONY: build
build:
	hugo --gc --minify

.PHONY: serve
serve:
	hugo server --bind 0.0.0.0

.PHONY: open
open:
	xdg-open "http://localhost:1313"

.PHONY: deploy
deploy:
	./scripts/deploy.sh

deploy-ipfs:
	command -v ipfs-deploy || npm i -g ipfs-deploy
	ipd -p pinata public --no-open
