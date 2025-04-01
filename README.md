# Inv.

Invoice builder and tracking software for small businesses and self-employed individuals.

## Build

### Environment

```bash
cp .env.template .env
```

Most variables have default values; `DATABASE_PASSWORD` is unset.

### Persistence

Create a Docker volume to persist database data

```bash
make persistence
```

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

Build services for a production environment.

```bash
make prod
```

## Documentation

### API

API documentation is available on [Postman](https://documenter.getpostman.com/view/22285722/2sB2cRDPxj#b6f50fc6-3c30-453a-8a80-4e75030f632f).
