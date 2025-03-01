use repository::service::{
  self, DraftInvoiceMutation, MutateDraftInvoiceError, MutatedDraftInvoice,
};
use rocket::{http::Status, serde::json::Json};

use crate::util::response::APIResponse;

#[post("/invoice.draft.mutate", data = "<data>")]
pub fn invoice_draft_mutate(
  data: Json<DraftInvoiceMutation>,
) -> APIResponse<MutatedDraftInvoice, String> {
  let data = data.into_inner();
  service::mutate_draft_invoice(data).map_or_else(
    |error| {
      let (status, error) = match error {
        MutateDraftInvoiceError::ConnectionError(_) => (
          Status::InternalServerError,
          String::from("An error occurred while connecting to the database"),
        ),
        MutateDraftInvoiceError::UnknownError(e) => (
          Status::InternalServerError,
          format!("An unknown error occurred: {:?}", e.to_string()),
        ),
        MutateDraftInvoiceError::InvoiceNotFound => (
          Status::UnprocessableEntity,
          String::from("Invoice not found"),
        ),
        MutateDraftInvoiceError::InvalidClient => {
          (Status::UnprocessableEntity, String::from("Invalid client"))
        }
        MutateDraftInvoiceError::InvalidLocation => (
          Status::UnprocessableEntity,
          String::from("Invalid location"),
        ),
        MutateDraftInvoiceError::NotDraftInvoice => (
          Status::UnprocessableEntity,
          String::from("Invoice is not in draft state and is therefore immutable"),
        ),
      };
      APIResponse {
        status: Some(status),
        error: Some(error),
        data: None,
      }
    },
    |invoice| APIResponse {
      status: Some(Status::Ok),
      data: Some(invoice),
      error: None,
    },
  )
}
