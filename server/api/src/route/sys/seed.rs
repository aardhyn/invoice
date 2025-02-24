use repository::service::{self, SeedResult};
use rocket::http::Status;

use crate::util::response::APIResponse;

#[post("/sys.seed")]
pub fn system_seed() -> APIResponse<SeedResult, String> {
  service::sys_seed().map_or_else(
    |error| match error {
      service::SeedError::AlreadySeeded => APIResponse {
        data: None,
        status: Some(Status::BadRequest),
        error: Some("The system has already been seeded".to_string()),
      },
      service::SeedError::ConnectionError(error) => APIResponse {
        data: None,
        status: Some(Status::InternalServerError),
        error: Some(String::from(format!(
          "An error occurred while connecting to the database: {}",
          error
        ))),
      },
      service::SeedError::UnknownError(error) => APIResponse {
        data: None,
        status: Some(Status::InternalServerError),
        error: Some(String::from(format!(
          "An error unknown error occurred while connecting to the database: {}",
          error
        ))),
      },
    },
    |data| APIResponse {
      data: Some(data),
      status: Some(Status::Ok),
      error: None,
    },
  )
}
