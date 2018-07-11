.PHONY: all
all: build

.PHONY: build
build:
	jekyll build

.PHONY: serve
serve:
	jekyll serve

.PHONY: js
js:
	#npm i grunt-cli -g
	grunt compile-scripts

.PHONY: css
css:
	grunt compile-styles

.PHONY: deploy
deploy:
	grunt deploy
