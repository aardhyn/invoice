.PHONY: dev stop build prod dev.build prod.build clean format test database-admin database-volume

include .env

# Run each service in development mode in containers
dev:
	docker compose --env-file .env --profile dev up -d;

# Build and/or run each service in production mode in containers
prod:
	docker compose --env-file .env --profile prod up -d;

# Build the images of each service for production
dev.build:
	docker compose --profile dev build;

# Build the images of each service for production
prod.build:
	docker compose --profile prod build;

# Reapply the latest migration 
migrate:
	docker exec -w /app/repository -it server.dev \
	diesel migration redo --database-url=postgresql://$(DATABASE_USER):$(DATABASE_PASSWORD)@$(DATABASE_HOST):$(DATABASE_PORT)

# Stop all running services
stop:
	docker compose --env-file .env --profile prod --profile dev down;

# Remove install dependencies and build artifacts
clean:
	rm -rf client/node_modules client/dist;
	rm -rf server/target;

# Run the formatters
format:
	docker exec -it client.dev pnpm run format;
	docker exec -it server.dev cargo fmt;

# Run the linters
lint:
	docker exec -it client.dev pnpm run lint;

# Run the tests suites
test:
	docker exec -it server.dev cargo test;

# Attach to the database container
database-admin:
	docker exec -it database.dev psql -U postgres -d postgres;

# Create the database volume
persistence:
	docker volume create invoice_postgres_data;