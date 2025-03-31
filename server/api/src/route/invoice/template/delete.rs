use crate::{middleware::dev_key::DevKey, util::response::APIResponse};
use repository::service::{self, DeleteInvoiceTemplate, DeletedInvoiceTemplate};
use rocket::{http::Status, serde::json::Json};

#[post("/invoice.template.delete", data = "<data>")]
pub fn invoice_template_delete(
  data: Json<DeleteInvoiceTemplate>,
  _key: DevKey,
) -> APIResponse<DeletedInvoiceTemplate, String> {
  let data = data.into_inner();
  service::delete_invoice_template(data).map_or_else(
    |error| {
      let (status, error) = match error {
        service::DeleteInvoiceTemplateError::InvoiceTemplateNotFound => (
          Status::BadRequest,
          String::from("Invoice template not found"),
        ),
        service::DeleteInvoiceTemplateError::ConnectionError(_) => (
          Status::InternalServerError,
          String::from("An error occurred while connecting to the database"),
        ),
        service::DeleteInvoiceTemplateError::UnknownError(e) => (
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
