use repository::service::{self, ServiceList};
use rocket::{http::Status, serde::json::Json};
use serde::Deserialize;

use crate::util::response::APIResponse;

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ServiceListParams {
  pub business_id: i32,
}

#[post("/service.list", data = "<data>")]
pub fn service_list(data: Json<ServiceListParams>) -> APIResponse<ServiceList, String> {
  service::list_services(data.business_id).map_or_else(
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
