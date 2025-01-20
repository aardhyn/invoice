use std::fmt;

use diesel::result::Error;
use serde::Deserialize;

use crate::connection::establish_connection;
use crate::model::*;
use crate::utility::invoice::{invoice_key, InvoiceKeyError};
use diesel::prelude::*;

#[derive(Debug)]
pub enum DuplicateInvoiceError {
  ConnectionError(ConnectionError),
  UnknownError(Error),
}

impl fmt::Display for DuplicateInvoiceError {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    write!(f, "{:?}", self)
  }
}

impl From<Error> for DuplicateInvoiceError {
  fn from(error: Error) -> Self {
    DuplicateInvoiceError::UnknownError(error)
  }
}

impl From<InvoiceKeyError> for DuplicateInvoiceError {
  fn from(error: InvoiceKeyError) -> Self {
    match error {
      InvoiceKeyError::CountBusinessError(error) => DuplicateInvoiceError::UnknownError(error),
    }
  }
}

#[derive(Deserialize)]
pub struct DuplicateInvoice {
  invoice_id: i32,
}

pub type DuplicatedInvoice = DuplicatedInvoiceEntity;

pub fn duplicate_invoice(
  DuplicateInvoice { invoice_id }: DuplicateInvoice,
) -> Result<DuplicatedInvoice, DuplicateInvoiceError> {
  use crate::schema::invoice;

  let connection = &mut establish_connection().map_err(DuplicateInvoiceError::ConnectionError)?;

  let invoice = invoice::table
    .find(invoice_id)
    .select(DuplicatingInvoiceEntity::as_select())
    .first(connection)
    .map_err(DuplicateInvoiceError::from)?;

  let invoice_key =
    invoice_key(connection, invoice.business_id).expect("failed to generate invoice key");

  let new_invoice = diesel::insert_into(invoice::table)
    .values(NewInvoiceEntity {
      invoice_key,
      name: invoice.name,
      description: invoice.description,
      reference: invoice.reference,
      due_date: invoice.due_date,
      business_id: invoice.business_id,
      client_id: invoice.client_id,
      location_id: invoice.location_id,
      payment_data: invoice.payment_data,
      client_data: invoice.client_data,
      location_data: invoice.location_data,
      line_items: invoice.line_items,
    })
    .returning(CreatedInvoiceEntity::as_returning())
    .get_result(connection)
    .map_err(DuplicateInvoiceError::from)?;

  Ok(new_invoice)
}
