.PHONY: dist

dist:
	rm -rf dist
	./node_modules/.bin/babel src -d dist
