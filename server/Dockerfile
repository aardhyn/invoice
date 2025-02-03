FROM rust:1.84.0
WORKDIR /usr/src/server
COPY . .
RUN cargo install diesel_cli --no-default-features --features postgres
RUN cargo build --release
CMD cd repository \
  && diesel migration run --database-url $DATABASE_URL \
  && /usr/src/server/target/release/api
