use rocket::fairing::{Fairing, Info, Kind};
use rocket::http::Header;
use rocket::{Request, Response};
use std::env;

pub struct CORS;

/// Catches all OPTION requests in order to get the CORS related Fairing triggered.
#[options("/<_..>")]
pub fn all_options() {
  /* Intentionally left empty */
}

#[rocket::async_trait]
impl Fairing for CORS {
  fn info(&self) -> Info {
    Info {
      name: "Add CORS headers to responses",
      kind: Kind::Response,
    }
  }

  async fn on_response<'r>(&self, _request: &'r Request<'_>, response: &mut Response<'r>) {
    let allow_origins =
      env::var("API_ALLOW_ORIGIN").expect("API_ALLOW_ORIGIN environment variable not found!");
    println!("origins: {allow_origins}");
    response.set_header(Header::new("Access-Control-Allow-Origin", allow_origins));
    response.set_header(Header::new(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept",
    ));
    response.set_header(Header::new("Access-Control-Allow-Credentials", "true"));
    response.set_header(Header::new(
      "Access-Control-Allow-Methods",
      "POST, GET, OPTIONS",
    ));
  }
}
