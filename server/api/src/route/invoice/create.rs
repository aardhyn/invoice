use repository::service::{self, CreateInvoice, CreatedInvoice};
use rocket::{http::Status, serde::json::Json};

use crate::util::response::APIResponse;

#[post("/invoice.create", data = "<data>")]
pub fn invoice_create(data: Json<CreateInvoice>) -> APIResponse<CreatedInvoice, String> {
  let data = data.into_inner();
  service::create_invoice(data).map_or_else(
    |error| {
      let (status, error) = match error {
        service::CreateInvoiceError::ConnectionError(_) => (
          Status::InternalServerError,
          String::from("An error occurred while connecting to the database"),
        ),
        service::CreateInvoiceError::InvalidBusiness => (
          Status::BadRequest,
          String::from("The business ID provided is invalid"),
        ),
        service::CreateInvoiceError::UnknownError(e) => (
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
