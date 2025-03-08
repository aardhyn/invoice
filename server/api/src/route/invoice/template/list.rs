use repository::service::{self, InvoiceTemplateList};
use rocket::{http::Status, serde::json::Json};
use serde::Deserialize;

use crate::util::response::APIResponse;

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct InvoiceTemplateListParams {
  business_id: i32,
}

#[post("/invoice.template.list", data = "<data>")]
pub fn invoice_template_list(
  data: Json<InvoiceTemplateListParams>,
) -> APIResponse<InvoiceTemplateList, String> {
  service::list_invoice_template(data.business_id).map_or_else(
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
