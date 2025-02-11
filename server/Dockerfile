FROM rust:1.84.0

RUN cargo install diesel_cli --no-default-features --features postgres

WORKDIR /app

COPY . .

RUN cargo build --release


CMD cd repository \
  && diesel migration run --database-url $DATABASE_URL \
  && /app/target/release/api
