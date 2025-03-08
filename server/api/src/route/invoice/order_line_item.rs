use crate::util::response::APIResponse;
use repository::service::{self, OrderLineItems, OrderedLineItems};
use rocket::{http::Status, serde::json::Json};
use serde::Deserialize;

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct LineItemReordering {
  pub invoice_id: i32,
  pub line_item: OrderLineItems,
}

#[post("/invoice.draft.line_item.order", data = "<data>")]
pub fn invoice_line_items_reorder(
  data: Json<LineItemReordering>,
) -> APIResponse<OrderedLineItems, String> {
  let data = data.into_inner();
  service::order_line_items(data.invoice_id, data.line_item).map_or_else(
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
