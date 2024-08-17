.PHONY: all database database.down database.connect server client
include .env

DATABASE_URL=postgres://$(DATABASE_USER):$(DATABASE_PASSWORD)@$(DATABASE_DOMAIN):$(DATABASE_PORT)

all:
	make database \
	&& make server;

database:
	docker compose --env-file .env up -d;

database.down:
	docker compose --env-file .env down;

database.connect:
	docker exec -it database psql -U postgres -d postgres;

server:
	cd server/repository \
	&& diesel migration run --database-url $(DATABASE_URL) \
	&& cd ../api \
	&& cargo run;

client:
	cd client \
	&& pnpm dev