all:
	@make --no-print-directory -C docs
	@echo ""
	@python3 gen.py

test:
	@make --no-print-directory -C docs
	@echo ""
	@python3 -m pytest gen.py

update-python:
	pip3 list --outdated --format=freeze | grep -v '^\-e' | cut -d = -f 1 | xargs -n1 pip3 install -U 