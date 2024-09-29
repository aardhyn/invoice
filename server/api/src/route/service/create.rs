use repository::service::{self, CreateService, CreatedService};
use rocket::{http::Status, serde::json::Json};

use crate::util::response::APIResponse;

#[post("/service.create", data = "<data>")]
pub fn service_create(data: Json<CreateService>) -> APIResponse<CreatedService, String> {
  let data = data.into_inner();
  service::create_service(data).map_or_else(
    |error| {
      let (status, error) = match error {
        service::CreateServiceError::ConnectionError(_) => (
          Status::InternalServerError,
          String::from("An error occurred while connecting to the database"),
        ),
        service::CreateServiceError::DuplicateNameError => (
          Status::Conflict,
          String::from("A service with that name already exists"),
        ),
        service::CreateServiceError::UnknownError(e) => (
          Status::InternalServerError,
          format!("An unknown error occurred: {:?}", e.to_string()),
        ),
      };
      APIResponse {
        status: Some(status),
        error: Some(error),
        data: None,
      }
    },
    |invoice| APIResponse {
      status: Some(Status::Created),
      data: Some(invoice),
      error: None,
    },
  )
}
