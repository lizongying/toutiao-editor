all: build

build:
	yarn run build && zip -r archive.zip ./dist

publish:

.PHONY: all