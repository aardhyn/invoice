# invoice

AGL Invoice builder

## Building

While the database runs in a container for local development you will still need to install PostgreSQL as the Diesel crate needs access to `libpq`.

## Development

Build and run the database container

```bash
make database
```

Run the build the backend, run the migrations, and start the server

```bash
make server
```
