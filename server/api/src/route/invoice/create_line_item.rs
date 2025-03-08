use crate::util::response::APIResponse;
use repository::service::{self, CreateLineItem, CreatedLineItem};
use rocket::{http::Status, serde::json::Json};
use serde::Deserialize;

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct LineItemCreate {
  pub invoice_id: i32,
  pub line_item: CreateLineItem,
}

#[post("/invoice.draft.line_item.create", data = "<data>")]
pub fn invoice_line_item_create(
  data: Json<LineItemCreate>,
) -> APIResponse<CreatedLineItem, String> {
  let data = data.into_inner();
  service::create_line_item(data.invoice_id, data.line_item).map_or_else(
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
