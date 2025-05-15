all: build

build:
	yarn run build && rm -f archive.zip && zip -r archive.zip ./docs

publish:

.PHONY: all