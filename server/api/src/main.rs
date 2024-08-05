use route::router::build_router;
use service::start_service;
use std::env;

mod route;
mod service;

#[tokio::main]
async fn main() -> Result<(), String> {
  tracing_subscriber::fmt::init();

  dotenvy::dotenv().expect("Failed to load .env file");
  let port = env::var("API_PORT").expect("API_PORT must be set");
  let origin = env::var("API_ORIGIN").expect("API_ORIGIN must be set");

  let router = build_router();
  start_service(port, origin, router).await
}
