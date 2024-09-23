use repository::service::{self, InvoiceList};
use rocket::http::Status;

use crate::util::response::APIResponse;

#[get("/invoice.list")]
pub fn invoice_list() -> APIResponse<InvoiceList, String> {
  service::list_invoices().map_or_else(
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
