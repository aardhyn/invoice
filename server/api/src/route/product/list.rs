use repository::service::{self, ProductList};
use rocket::http::Status;

use crate::util::response::APIResponse;

#[get("/product.list")]
pub fn product_list() -> APIResponse<ProductList, String> {
  service::list_products().map_or_else(
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
