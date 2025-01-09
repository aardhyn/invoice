use std::fmt;

use diesel::result::Error;

use crate::connection::establish_connection;
use crate::model::*;
use diesel::prelude::*;

#[derive(Debug)]
pub enum DeleteInvoiceTemplateError {
  InvoiceTemplateNotFound,
  ConnectionError(ConnectionError),
  UnknownError(Error),
}

impl fmt::Display for DeleteInvoiceTemplateError {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    write!(f, "{:?}", self)
  }
}

impl From<Error> for DeleteInvoiceTemplateError {
  fn from(error: Error) -> Self {
    DeleteInvoiceTemplateError::UnknownError(error)
  }
}

pub type DeleteInvoiceTemplate = NewInvoiceTemplateEntity;

pub type DeletedInvoiceTemplate = CreatedInvoiceTemplateEntity;

pub fn delete_invoice_template(
  DeleteInvoiceTemplate { invoice_id }: DeleteInvoiceTemplate,
) -> Result<DeletedInvoiceTemplate, DeleteInvoiceTemplateError> {
  use crate::schema::invoice_template;

  let connection =
    &mut establish_connection().map_err(DeleteInvoiceTemplateError::ConnectionError)?;

  connection.transaction::<_, DeleteInvoiceTemplateError, _>(|connection| {
    diesel::delete(invoice_template::table)
      .filter(invoice_template::invoice_id.eq(invoice_id))
      .returning(InvoiceTemplateEntity::as_returning())
      .get_result(connection)
      .map_err(|error| match error {
        Error::NotFound => DeleteInvoiceTemplateError::InvoiceTemplateNotFound,
        error => DeleteInvoiceTemplateError::UnknownError(error),
      })?;

    Ok(DeletedInvoiceTemplate { invoice_id })
  })
}
