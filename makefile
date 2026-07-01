# all: assets
# 	@echo ""
# 	@python3 gen.py

.PHONY: astro

astro: node_modules
	npm run build

node_modules:
	npm ci --force

clean: 
	@rm -fr dist

docker-build:
	docker build . -t test-lychee-docker --progress plain  

docker-run: docker-build
	docker run -p 9999:80 -t test-lychee-docker
