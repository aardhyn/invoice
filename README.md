# invoice

Invoice builder and tracking software

## Building

Install the [Diesel CLI](https://diesel.rs/guides/getting-started#installing-diesel-cli). You will only need postgres feature for this project.

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

Install the web client dependencies

```bash
cd client && pnpm install
```

Build and run the web client in development mode

```bash
make client
```
