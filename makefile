all:
	@python3 gen.py
	@echo ""
	@make --no-print-directory -C docs

test:
	@python3 -m pytest gen.py
