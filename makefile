all: assets
	@echo ""
	@python3 gen.py

.PHONY: assets

assets:
	mkdir -p build
	cp -r assets build/
	cp -r demo build/
	mkdir -p build/docs
	cp -r docs/css build/docs/
	cp -r docs/img build/docs/
	cp -r docs/js build/docs/

test: assets
	@echo ""
	@python3 -m pytest gen.py

update-python:
	pip3 list --outdated --format=freeze | grep -v '^\-e' | cut -d = -f 1 | xargs -n1 pip3 install -U 

clean: 
	@rm -fr build