use repository::service::{self, DuplicateInvoice, DuplicatedInvoice};
use rocket::{http::Status, serde::json::Json};

use crate::util::response::APIResponse;

#[post("/invoice.duplicate", data = "<data>")]
pub fn invoice_duplicate(data: Json<DuplicateInvoice>) -> APIResponse<DuplicatedInvoice, String> {
  let data = data.into_inner();
  service::duplicate_invoice(data).map_or_else(
    |error| {
      let (status, error) = match error {
        service::DuplicateInvoiceError::ConnectionError(_) => (
          Status::InternalServerError,
          String::from("An error occurred while connecting to the database"),
        ),
        service::DuplicateInvoiceError::InvoiceNotFound => {
          (Status::NotFound, String::from("Invalid invoice"))
        }
        service::DuplicateInvoiceError::UnknownError(e) => (
          Status::InternalServerError,
          format!("An unknown error occurred: {:?}", e.to_string()),
        ),
      };
      APIResponse {
        status: Some(status),
        error: Some(error),
        data: None,
      }
    },
    |invoice| APIResponse {
      status: Some(Status::Created),
      data: Some(invoice),
      error: None,
    },
  )
}
