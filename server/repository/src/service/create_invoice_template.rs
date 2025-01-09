use std::fmt;

use diesel::result::{DatabaseErrorKind, Error};

use crate::connection::establish_connection;
use crate::model::*;
use diesel::prelude::*;

#[derive(Debug)]
pub enum CreateInvoiceTemplateError {
  InvoiceTemplateAlreadyExists,
  ConnectionError(ConnectionError),
  UnknownError(Error),
}

impl fmt::Display for CreateInvoiceTemplateError {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    write!(f, "{:?}", self)
  }
}

impl From<Error> for CreateInvoiceTemplateError {
  fn from(error: Error) -> Self {
    CreateInvoiceTemplateError::UnknownError(error)
  }
}

pub type CreateInvoiceTemplate = NewInvoiceTemplateEntity;

pub type CreatedInvoiceTemplate = CreatedInvoiceTemplateEntity;

pub fn create_invoice_template(
  CreateInvoiceTemplate { invoice_id }: CreateInvoiceTemplate,
) -> Result<CreatedInvoiceTemplate, CreateInvoiceTemplateError> {
  use crate::schema::invoice_template;

  let connection =
    &mut establish_connection().map_err(CreateInvoiceTemplateError::ConnectionError)?;

  diesel::insert_into(invoice_template::table)
    .values(&NewInvoiceTemplateEntity { invoice_id })
    .returning(CreatedInvoiceTemplateEntity::as_returning())
    .get_result(connection)
    .map_err(|error| match error {
      Error::DatabaseError(DatabaseErrorKind::UniqueViolation, _) => {
        CreateInvoiceTemplateError::InvoiceTemplateAlreadyExists
      }
      error => CreateInvoiceTemplateError::UnknownError(error),
    })?;

  Ok(CreatedInvoiceTemplate { invoice_id })
}
