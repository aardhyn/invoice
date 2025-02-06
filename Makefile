.PHONY: dev stop build prod server.clean client.clean clean database-admin

# Run each service in development mode in containers
dev:
	docker compose --env-file .env --profile dev up -d;

# Build and/or run each service in production mode in containers
prod:
	docker compose --env-file .env --profile prod up -d;

# Build the images of each service for production
build.dev:
	docker compose --profile dev build 

# Build the images of each service for production
build.prod:
	docker compose --profile prod build 

# Stop all running services
stop:
	docker compose --env-file .env --profile prod --profile dev down;

client.clean:
	rm -rf client/node_modules client/dist;

server.clean:
	rm -rf server/target

clean: client.clean server.clean

# Access the database container as an admin
database-admin:
	docker exec -it database psql -U postgres -d postgres;