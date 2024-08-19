use diesel::pg::PgConnection;
use diesel::prelude::*;

use std::env;

pub fn establish_connection() -> Result<PgConnection, diesel::ConnectionError> {
  dotenvy::dotenv().expect("Failed to load .env file");

  let host = env::var("DATABASE_DOMAIN").expect("DATABASE_DOMAIN must be set");
  let port = env::var("DATABASE_PORT").expect("DATABASE_PORT must be set");
  let user = env::var("DATABASE_USER").expect("DATABASE_USER must be set");
  let password = env::var("DATABASE_PASSWORD").expect("DATABASE_PASSWORD must be set");
  let connection_string = format!("postgres://{}:{}@{}:{}", user, password, host, port);

  PgConnection::establish(&connection_string)
}
