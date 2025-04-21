all: build

clean:
	cd dist && rm ./*

build:
	yarn run build && cd dist && zip -v archive.zip *

publish:

.PHONY: all