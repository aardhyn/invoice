use repository::service::{self, InvoiceList};
use rocket::{http::Status, serde::json::Json};
use serde::Deserialize;

use crate::util::response::APIResponse;

#[derive(Deserialize)]
pub struct InvoiceListParams {
  pub business_id: i32,
}

#[post("/invoice.list", data = "<data>")]
pub fn invoice_list(data: Json<InvoiceListParams>) -> APIResponse<InvoiceList, String> {
  service::list_invoices(data.business_id).map_or_else(
    |e| APIResponse {
      status: Some(Status::BadRequest),
      data: None,
      error: Some(e.to_string()),
    },
    |invoices| APIResponse {
      status: Some(Status::Ok),
      data: Some(invoices),
      error: None,
    },
  )
}
