use repository::service::{self, CreateProduct, CreatedProduct};
use rocket::{http::Status, serde::json::Json};

use crate::util::response::APIResponse;

#[post("/product.create", data = "<data>")]
pub fn product_create(data: Json<CreateProduct>) -> APIResponse<CreatedProduct, String> {
  let data = data.into_inner();
  service::create_product(data).map_or_else(
    |error| {
      let (status, error) = match error {
        service::CreateProductError::ConnectionError(_) => (
          Status::InternalServerError,
          String::from("An error occurred while connecting to the database"),
        ),
        service::CreateProductError::DuplicateNameError => (
          Status::Conflict,
          String::from("A product with that name already exists"),
        ),
        service::CreateProductError::UnknownError(e) => (
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
