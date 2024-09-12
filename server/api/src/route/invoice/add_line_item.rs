use rocket::{http::Status, serde::json::Json};

use repository::service::{self, CreateLineItem, CreatedLineItem};

use crate::util::response::APIResponse;

#[post("/invoice.line_item.add", data = "<data>")]
pub fn invoice_line_item_add(data: Json<CreateLineItem>) -> APIResponse<CreatedLineItem, String> {
  let item = data.into_inner();
  service::add_line_item(item).map_or_else(
    |e| APIResponse {
      status: Some(Status::BadRequest),
      data: None,
      error: Some(e.to_string()),
    },
    |created_line_item| APIResponse {
      status: Some(Status::Ok),
      data: Some(created_line_item),
      error: None,
    },
  )
}
