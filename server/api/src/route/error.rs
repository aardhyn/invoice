use rocket::{http::Status, Request};

use crate::util::response::APIResponse;

#[catch(404)]
pub fn handle_not_found(_: &Request) -> APIResponse<(), String> {
  APIResponse {
    status: Some(Status::NotFound),
    error: Some(String::from("Resource not found")),
    data: None,
  }
}

#[catch(500)]
pub fn handle_internal_server_error(_: &Request) -> APIResponse<(), String> {
  APIResponse {
    status: Some(Status::InternalServerError),
    error: Some(String::from("Internal server error")),
    data: None,
  }
}

#[catch(422)]
pub fn handle_unprocessable_entity(_: &Request) -> APIResponse<(), String> {
  APIResponse {
    status: Some(Status::BadRequest),
    error: Some(String::from(
      "Request provided invalid input and cannot be processed",
    )),
    data: None,
  }
}
