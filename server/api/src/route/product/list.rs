use crate::util::response::APIResponse;
use repository::service::{self, ProductList};
use rocket::{http::Status, serde::json::Json};
use serde::Deserialize;

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ProductListParams {
  business_id: i32,
}

#[post("/product.list", data = "<data>")]
pub fn product_list(data: Json<ProductListParams>) -> APIResponse<ProductList, String> {
  service::list_products(data.business_id).map_or_else(
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
