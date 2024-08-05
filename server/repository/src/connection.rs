use diesel::pg::PgConnection;
use diesel::prelude::*;

use std::env;

pub fn establish_connection() -> Result<PgConnection, diesel::ConnectionError> {
  dotenvy::dotenv().expect("Failed to load .env file");

  let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");

  let connection = PgConnection::establish(&database_url);
  connection
}
