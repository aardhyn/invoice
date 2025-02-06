# Inv.

Invoice builder and tracking software

## Build

### Environment

```bash
cp .env.template .env
```

Most variables have default values; `DATABASE_PASSWORD` is unset.

### Development

Build and run each service

```bash
make
# or
make dev
```

This builds and runs each component in Docker containers. Web content is served to [https://localhost:$CLIENT_PORT](https://localhost:$CLIENT_PORT).

Stop services with

```bash
make stop
```

See the [Makefile](Makefile) for more commands and details.

### Production

Build services for a production environment

```bash
make prod
```
