all: build

build:
	yarn run build && zip -r archive.zip ./docs

publish:

.PHONY: all