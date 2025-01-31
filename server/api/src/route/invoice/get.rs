use repository::service::{self, Invoice};
use rocket::{http::Status, serde::json::Json};
use serde::Deserialize;

use crate::util::response::APIResponse;

#[derive(Deserialize)]
pub struct InvoiceGetParams {
  pub invoice_id: i32,
}

#[post("/invoice.get", data = "<data>")]
pub fn invoice_get(data: Json<InvoiceGetParams>) -> APIResponse<Invoice, String> {
  let invoice_id = data.into_inner().invoice_id;

  service::get_invoice(invoice_id).map_or_else(
    |e| {
      let (error, status) = match e {
        service::GetInvoiceError::ConnectionError(_) => (
          String::from("Error connecting to database"),
          Status::InternalServerError,
        ),
        service::GetInvoiceError::NotFound => (String::from("Invoice not found"), Status::NotFound),
        service::GetInvoiceError::UnknownError(_) => {
          (String::from("Unknown error"), Status::InternalServerError)
        }
      };
      APIResponse {
        data: None,
        status: Some(status),
        error: Some(error),
      }
    },
    |invoice| APIResponse {
      status: Some(Status::Ok),
      data: Some(invoice),
      error: None,
    },
  )
}
