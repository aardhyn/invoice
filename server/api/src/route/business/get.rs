use repository::service::{self, Business};
use rocket::{http::Status, serde::json::Json};
use serde::Deserialize;

use crate::util::response::APIResponse;

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct BusinessGetParams {
  pub business_id: i32,
}

#[post("/business.get", data = "<data>")]
pub fn business_get(data: Json<BusinessGetParams>) -> APIResponse<Business, String> {
  let business_id = data.into_inner().business_id;

  service::get_business(business_id).map_or_else(
    |e| {
      let (error, status) = match e {
        service::GetBusinessError::ConnectionError(_) => (
          String::from("Error connecting to database"),
          Status::InternalServerError,
        ),
        service::GetBusinessError::NotFound => {
          (String::from("Business not found"), Status::NotFound)
        }
        service::GetBusinessError::UnknownError(_) => {
          (String::from("Unknown error"), Status::InternalServerError)
        }
      };
      APIResponse {
        data: None,
        status: Some(status),
        error: Some(error),
      }
    },
    |invoice| APIResponse {
      status: Some(Status::Ok),
      data: Some(invoice),
      error: None,
    },
  )
}
