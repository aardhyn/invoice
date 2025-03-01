#[macro_use]
extern crate rocket;

mod middleware;
mod route;
mod util;

use middleware::cors;
use route::*;
use util::rocket::build_config;

#[rocket::main]
async fn main() -> Result<(), String> {
  dotenvy::dotenv().ok(); // note: we don't care if this fails because the variables might be set some other way.

  let catchers = catchers![handle_not_found, handle_unprocessable_entity];

  let routes = routes![
    cors::all_options,
    business_create,
    business_list,
    business_get,
    client_create,
    client_list,
    service_create,
    service_list,
    product_create,
    product_list,
    invoice_create,
    invoice_list,
    invoice_get,
    invoice_draft_mutate,
    invoice_duplicate,
    invoice_line_item_add,
    invoice_template_create,
    invoice_template_delete,
    invoice_template_list,
    system_seed,
  ];

  let config = build_config()?;

  rocket::build()
    .configure(config)
    .attach(cors::CORS)
    .register("/", catchers)
    .mount("/", routes)
    .launch()
    .await
    .map_err(|e| format!("Failed to launch Rocket: {}", e))?;

  Ok(())
}
