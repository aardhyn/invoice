use std::fmt;

use diesel::result::Error;
use diesel::{ConnectionError, SelectableHelper};
use serde::{Deserialize, Serialize};

use crate::connection::establish_connection;
use crate::model::*;
use crate::utility::invoice::{invoice_key, next_untitled_invoice_name};

use diesel::prelude::*;

#[derive(Debug)]
pub enum CreateInvoiceError {
  InvalidBusiness,
  ConnectionError(ConnectionError),
  UnknownError(Error),
}

impl fmt::Display for CreateInvoiceError {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    write!(f, "{:?}", self)
  }
}

impl From<Error> for CreateInvoiceError {
  fn from(error: Error) -> Self {
    CreateInvoiceError::UnknownError(error)
  }
}

#[derive(Debug, Deserialize)]
pub struct CreateInvoice {
  pub business_id: i32,
}

#[derive(Debug, Serialize)]
pub struct CreatedInvoice {
  pub invoice_id: i32,
}

pub fn create_invoice(new_invoice: CreateInvoice) -> Result<CreatedInvoice, CreateInvoiceError> {
  use crate::schema::invoice;

  let connection = &mut establish_connection().map_err(CreateInvoiceError::ConnectionError)?;

  // fixme: interrogate these errors better. They should be akin to "unknown error occurred, but we've logged it with support".
  let invoice_key = invoice_key(connection, new_invoice.business_id)
    .map_err(|error| CreateInvoiceError::UnknownError(error))?;

  let invoice_name = next_untitled_invoice_name(connection, new_invoice.business_id)
    .map_err(|error| CreateInvoiceError::UnknownError(error))?;

  let created_invoice = diesel::insert_into(invoice::table)
    .values(&NewInvoiceEntity {
      business_id: new_invoice.business_id,
      name: invoice_name,
      invoice_key,
    })
    .returning(CreatedInvoiceEntity::as_returning())
    .get_result(connection)
    .map_err(CreateInvoiceError::UnknownError)?;

  Ok(CreatedInvoice {
    invoice_id: created_invoice.invoice_id,
  })
}
