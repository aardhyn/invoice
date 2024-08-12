use repository::service::{self, BusinessList, CreateBusiness, CreatedBusiness};
use rocket::{http::Status, serde::json::Json};

use crate::util::response::APIResponse;

#[get("/business.list")]
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

#[post("/business.create", data = "<data>")]
pub fn business_create(data: Json<CreateBusiness>) -> APIResponse<CreatedBusiness, String> {
  let data = data.into_inner();
  service::create_business(data).map_or_else(
    |error| {
      let (status, error) = match error {
        service::CreateBusinessError::NonUniqueContact => (
          Status::BadRequest,
          String::from("A business with this contact already exists"),
        ),
        service::CreateBusinessError::NonUniquePayment => (
          Status::BadRequest,
          String::from("A business with this payment already exists"),
        ),
        service::CreateBusinessError::UnknownError(e) => (
          Status::InternalServerError,
          format!("An unknown error occurred: {:?}", e.to_string()),
        ),
        service::CreateBusinessError::ConnectionError(_) => (
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
