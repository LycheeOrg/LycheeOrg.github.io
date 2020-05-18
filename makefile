all:
	@python3 gen.py
	@echo ""
	@cd docs && python3 build.py

test:
	@python3 -m pytest gen.py
