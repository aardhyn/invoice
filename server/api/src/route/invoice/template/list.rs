use repository::service::{self, InvoiceTemplateList};
use rocket::http::Status;

use crate::util::response::APIResponse;

#[get("/invoice.template.list")]
pub fn invoice_template_list() -> APIResponse<InvoiceTemplateList, String> {
  service::list_invoice_template().map_or_else(
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
