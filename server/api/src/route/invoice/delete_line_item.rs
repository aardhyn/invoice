use crate::{middleware::dev_key::DevKey, util::response::APIResponse};
use repository::service::{self, DeletedLineItem};
use rocket::{http::Status, serde::json::Json};
use serde::Deserialize;
use uuid::Uuid;

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct LineItemDeletion {
  pub invoice_id: i32,
  pub line_item_key: Uuid,
}

#[post("/invoice.draft.line_item.delete", data = "<data>")]
pub fn invoice_line_item_delete(
  data: Json<LineItemDeletion>,
  _key: DevKey,
) -> APIResponse<DeletedLineItem, String> {
  let data = data.into_inner();
  service::delete_line_item(data.invoice_id, data.line_item_key).map_or_else(
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
