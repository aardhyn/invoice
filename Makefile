.PHONY: start build stop database-admin

start:
	docker compose --env-file .env up -d;

build:
	docker compose build

stop:
	docker compose --env-file .env down;

database-admin:
	docker exec -it database psql -U postgres -d postgres;