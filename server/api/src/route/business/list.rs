use repository::service::{self, BusinessList};
use rocket::http::Status;

use crate::util::response::APIResponse;
#[post("/business.list")]
pub fn business_list() -> APIResponse<BusinessList, String> {
  service::list_businesses().map_or_else(
    |e| APIResponse {
      status: Some(Status::BadRequest),
      data: None,
      error: Some(e.to_string()),
    },
    |businesses| APIResponse {
      status: Some(Status::Ok),
      data: Some(businesses),
      error: None,
    },
  )
}
