use repository::service::{self, CreateInvoiceTemplate, CreatedInvoiceTemplate};
use rocket::{http::Status, serde::json::Json};

use crate::util::response::APIResponse;

#[post("/invoice.template.create", data = "<data>")]
pub fn invoice_template_create(
  data: Json<CreateInvoiceTemplate>,
) -> APIResponse<CreatedInvoiceTemplate, String> {
  let data = data.into_inner();
  service::create_invoice_template(data).map_or_else(
    |error| {
      let (status, error) = match error {
        service::CreateInvoiceTemplateError::InvoiceTemplateAlreadyExists => (
          Status::BadRequest,
          String::from("Invoice template already exists"),
        ),
        service::CreateInvoiceTemplateError::ConnectionError(_) => (
          Status::InternalServerError,
          String::from("An error occurred while connecting to the database"),
        ),
        service::CreateInvoiceTemplateError::UnknownError(e) => (
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
