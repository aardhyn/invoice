use repository::service::{self, CreateClient, CreatedClient};
use rocket::{http::Status, serde::json::Json};

use crate::util::response::APIResponse;

#[post("/client.create", data = "<data>")]
pub fn client_create(data: Json<CreateClient>) -> APIResponse<CreatedClient, String> {
  let data = data.into_inner();
  service::create_client(data).map_or_else(
    |error| {
      let (status, error) = match error {
        service::CreateClientError::NonUniqueContact => (
          Status::BadRequest,
          String::from("A business with this contact already exists"),
        ),
        service::CreateClientError::UnknownError(e) => (
          Status::InternalServerError,
          format!("An unknown error occurred: {:?}", e.to_string()),
        ),
        service::CreateClientError::ConnectionError(_) => (
          Status::InternalServerError,
          String::from("An error occurred while connecting to the database"),
        ),
      };
      APIResponse {
        status: Some(status),
        error: Some(error),
        data: None,
      }
    },
    |business| APIResponse {
      status: Some(Status::Created),
      data: Some(business),
      error: None,
    },
  )
}
