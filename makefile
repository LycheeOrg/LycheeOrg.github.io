all:
	@make --no-print-directory -C docs
	@echo ""
	@python3 gen.py

test:
	@make --no-print-directory -C docs
	@echo ""
	@python3 -m pytest gen.py
