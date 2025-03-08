use rocket::http::{ContentType, Status};
use rocket::response::{self, Responder};
use rocket::Request;
use serde::Serialize;
use std::io::Cursor;

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct APIResponse<T, E> {
  pub status: Option<Status>,
  pub error: Option<E>,
  pub data: Option<T>,
}

impl<'r, T: Serialize> Responder<'r, 'static> for APIResponse<T, String> {
  fn respond_to(self, _: &'r Request<'_>) -> response::Result<'static> {
    let json = serde_json::to_string(&self).expect("Failed to serialize Response");

    let status = self.status.unwrap_or_else(|| {
      if self.error.is_some() {
        Status::InternalServerError
      } else {
        Status::Ok
      }
    });

    let response = response::Response::build()
      .status(status)
      .sized_body(json.len(), Cursor::new(json))
      .header(ContentType::JSON)
      .ok();

    print!("Response: {:?}", response);

    response
  }
}
