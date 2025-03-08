use crate::util::response::APIResponse;
use repository::service::{self, MutableLineItem, MutatedLineItem};
use rocket::{http::Status, serde::json::Json};
use serde::Deserialize;

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct LineItemMutation {
  pub invoice_id: i32,
  pub mutation: MutableLineItem,
}

#[post("/invoice.draft.line_item.mutate", data = "<data>")]
pub fn invoice_line_item_mutate(
  data: Json<LineItemMutation>,
) -> APIResponse<MutatedLineItem, String> {
  let data = data.into_inner();
  service::mutate_line_item(data.invoice_id, data.mutation).map_or_else(
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
