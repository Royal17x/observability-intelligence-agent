.PHONY: run test lint docker-up docker-down

run:
	uv run python -m uvicorn app.main:app --reload

test:
	uv run pytest tests/ -v

lint:
	uv run ruff check .

docker-up:
	docker-compose up -d

docker-down:
	docker-compose down

install:
	uv sync