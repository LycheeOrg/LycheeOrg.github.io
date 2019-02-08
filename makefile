all:
	@python3 gen.py

test:
	@python3 -m pytest gen.py
