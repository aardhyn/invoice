.PHONY: help database database.down database.rebuild database.connect server client
include .env

DATABASE_URL=postgres://$(DATABASE_USER):$(DATABASE_PASSWORD)@$(DATABASE_DOMAIN):$(DATABASE_PORT)

# Show help
# (also directs argless `make` command to a sensible default)
help:
	echo "Usage: make backend|client|database|database.down|database.rebuild|database.connect|migrate|server";

# Start the database
database:
	docker compose --env-file .env up -d;

# Stop the database
database.down:
	docker compose --env-file .env down;

# Destroy and rebuild the database
# (Yes, This will delete all data in the database)
database.rebuild:
	make database.down \
	&& make database;

# Connect to the database
database.connect:
	docker exec -it database psql -U postgres -d postgres;

# Run the database migrations
migrate:
	cd server/repository \
	&& diesel migration run --database-url $(DATABASE_URL);

# Migrate the database and build and run the server
server:
	make migrate \
	&& cd server/api \
	&& cargo run;

#	Build and run the web client in development mode
client:
	cd client \
	&& pnpm dev;
