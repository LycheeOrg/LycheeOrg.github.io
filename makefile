all: assets
	@echo ""
	@python3 gen.py

.PHONY: assets

node_modules:
	npm install

astro: node_modules
	npm run build

assets: astro
	mkdir -p dist/docs
	cp -r docs/css dist/docs/
	cp -r docs/fonts dist/docs/
	cp -r docs/img dist/docs/
	cp -r docs/js dist/docs/

test: assets
	@echo ""
	@python3 -m pytest gen.py

update-python:
	pip3 list --outdated --format=freeze | grep -v '^\-e' | cut -d = -f 1 | xargs -n1 pip3 install -U 

clean: 
	@rm -fr dist