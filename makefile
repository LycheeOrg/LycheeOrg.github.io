all: assets
	@echo ""
	@python3 gen.py

.PHONY: assets docs

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

docs:
	@echo ""
	@python3 gen.py

docker-build:
	docker build . -t test-lychee-docker --progress plain  

docker-run: docker-build
	docker run -p 9999:80 -t test-lychee-docker