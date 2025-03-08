use std::fmt;

use diesel::result::Error;
use serde::Deserialize;

use crate::connection::establish_connection;
use crate::model::*;
use crate::utility::invoice::{invoice_key, next_untitled_invoice_name};
use diesel::prelude::*;

#[derive(Debug)]
pub enum DuplicateInvoiceError {
  ConnectionError(ConnectionError),
  InvoiceNotFound,
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

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
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
    .select(InvoiceEntity::as_select()) // use DuplicateInvoiceEntity
    .first(connection)
    .map_err(|err| match err {
      Error::NotFound => DuplicateInvoiceError::InvoiceNotFound,
      _ => DuplicateInvoiceError::from(err),
    })?;

  let invoice_key =
    invoice_key(connection, invoice.business_id).map_err(DuplicateInvoiceError::from)?;

  let name = next_untitled_invoice_name(connection, invoice.business_id)
    .map_err(DuplicateInvoiceError::from)?;

  // change this to NewDuplicateInvoiceEntity... or something
  let new_invoice = diesel::insert_into(invoice::table)
    .values(DuplicateInvoiceEntity {
      invoice_key,
      name,
      business_id: invoice.business_id,
      description: invoice.description,
      reference: invoice.reference,
      client_id: invoice.client_id,
      line_items: invoice.line_items,
      address: invoice.address,
      suburb: invoice.suburb,
      city: invoice.city,
    })
    .returning(CreatedInvoiceEntity::as_returning())
    .get_result(connection)
    .map_err(DuplicateInvoiceError::from)?;

  Ok(new_invoice)
}
