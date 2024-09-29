#[macro_use]
extern crate rocket;

mod middleware;
mod route;
mod util;

use middleware::cors;
use route::*;

#[rocket::main]
async fn main() -> Result<(), rocket::Error> {
  dotenvy::dotenv().expect("Failed to load .env file");

  let catchers = catchers![handle_not_found, handle_unprocessable_entity];

  let routes = routes![
    cors::all_options,
    // Business //
    business_create,
    business_list,
    // Client //
    client_create,
    client_list,
    // Service //
    service_create,
    service_list,
    // Invoice //
    invoice_create,
    invoice_list,
    invoice_get,
    invoice_line_item_add,
    // Sys //
    system_seed,
  ];

  let _rocket = rocket::build()
    .attach(cors::CORS)
    .register("/", catchers)
    .mount("/", routes)
    .launch()
    .await?;

  Ok(())
}
