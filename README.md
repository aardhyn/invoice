# Inv.

Invoice builder and tracking software

## Build

### Environment

```bash
cp .env.template .env
```

Most variables have default values; `DATABASE_PASSWORD` is unset.

### Run

Build and run each service

```bash
make
```

This builds and runs each component in Docker containers. Web client is served to [https://localhost](https://localhost).

See [Makefile](Makefile) for more commands and details.
