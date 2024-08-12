#[macro_use]
extern crate rocket;

use error::*;
use middleware::cors;
use route::*;

mod error;
mod middleware;
mod route;
mod util;

#[rocket::main]
async fn main() -> Result<(), rocket::Error> {
  dotenvy::dotenv().expect("Failed to load .env file");

  let _rocket = rocket::build()
    .attach(cors::CORS)
    .register(
      "/",
      catchers![handle_not_found, handle_unprocessable_entity],
    )
    .mount(
      "/",
      routes![cors::all_options, business_create, business_list],
    )
    .launch()
    .await?;

  Ok(())
}
