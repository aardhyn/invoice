use repository::service::{self, ServiceList};
use rocket::http::Status;

use crate::util::response::APIResponse;

#[get("/service.list")]
pub fn service_list() -> APIResponse<ServiceList, String> {
  service::list_services().map_or_else(
    |e| APIResponse {
      status: Some(Status::BadRequest),
      data: None,
      error: Some(e.to_string()),
    },
    |services| APIResponse {
      status: Some(Status::Ok),
      data: Some(services),
      error: None,
    },
  )
}
