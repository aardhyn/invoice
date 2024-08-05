.PHONY: all database database.down database.connect server client
include .env

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
	&& diesel migration run \
	&& cd ../api \
	&& cargo run;

client:
	cd client \
	&& echo 'Not yet implemented';