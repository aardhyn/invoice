# invoice

Invoice builder and tracking software

## Building

While the database runs in a container for local development you will still need to install PostgreSQL as the Diesel crate needs access to `libpq`.

## Development

Build and run the database container

```bash
make database
```

Build the backend, run migrations, and start the REST API

```bash
make server
```

Build and run the web client in development mode

```bash
make client
```
