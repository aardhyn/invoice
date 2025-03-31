use rocket::{http::Status, Request};

use crate::util::response::APIResponse;

#[catch(400)]
pub fn handle_bad_request(_: &Request) -> APIResponse<(), String> {
  APIResponse {
    status: Some(Status::BadRequest),
    error: Some(String::from(
      "The request is malformed and cannot be understood by the server",
    )),
    data: None,
  }
}

#[catch(401)]
pub fn handle_unauthorized(_: &Request) -> APIResponse<(), String> {
  APIResponse {
    status: Some(Status::Unauthorized),
    error: Some(String::from("This request requires authentication")),
    data: None,
  }
}

#[catch(403)]
pub fn handle_forbidden(_: &Request) -> APIResponse<(), String> {
  APIResponse {
    status: Some(Status::Forbidden),
    error: Some(String::from("This request is not authorized")),
    data: None,
  }
}

#[catch(404)]
pub fn handle_not_found(_: &Request) -> APIResponse<(), String> {
  APIResponse {
    status: Some(Status::NotFound),
    error: Some(String::from("The requested resource was not found")),
    data: None,
  }
}

#[catch(500)]
pub fn handle_internal_server_error(_: &Request) -> APIResponse<(), String> {
  APIResponse {
    status: Some(Status::InternalServerError),
    error: Some(String::from(
      "This request was interrupted by an internal server error",
    )),
    data: None,
  }
}

#[catch(422)]
pub fn handle_unprocessable_entity(_: &Request) -> APIResponse<(), String> {
  APIResponse {
    status: Some(Status::BadRequest),
    error: Some(String::from(
      "The request provided invalid input and cannot be processed",
    )),
    data: None,
  }
}
