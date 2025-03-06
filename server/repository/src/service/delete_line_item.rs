use crate::connection::establish_connection;
use crate::model::{InvoiceLineItems, LineItemEntity};
use diesel::prelude::*;
use diesel::result::Error;
use serde::Serialize;
use std::fmt;
use uuid::Uuid;

#[derive(Debug)]
pub enum DeleteLineItemError {
  ConnectionError(ConnectionError),
  UnknownError(Error),
}

impl fmt::Display for DeleteLineItemError {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    write!(f, "{:?}", self)
  }
}

impl From<Error> for DeleteLineItemError {
  fn from(error: Error) -> Self {
    DeleteLineItemError::UnknownError(error)
  }
}

#[derive(Debug, Serialize)]
pub struct DeletedLineItem {
  invoice_id: i32,
  line_item_key: Uuid,
}

pub fn delete_line_item(
  invoice_id: i32,
  line_item_key: Uuid,
) -> Result<DeletedLineItem, DeleteLineItemError> {
  use crate::schema::invoice;

  let connection = &mut establish_connection().map_err(DeleteLineItemError::ConnectionError)?;

  let invoice = invoice::table
    .find(invoice_id)
    .select(InvoiceLineItems::as_select())
    .first(connection)
    .map_err(|error| DeleteLineItemError::UnknownError(error))?;

  let line_items: Vec<LineItemEntity> =
    serde_json::from_value(invoice.line_items).map_err(|error| {
      DeleteLineItemError::UnknownError(Error::DeserializationError(Box::new(error)))
    })?;

  let reduced_line_items = line_items
    .into_iter()
    .filter(|line_item| line_item.key != line_item_key)
    .collect::<Vec<LineItemEntity>>();

  let reduced_line_items_json = serde_json::to_value(&reduced_line_items).map_err(|error| {
    DeleteLineItemError::UnknownError(Error::SerializationError(Box::new(error)))
  })?;

  diesel::update(invoice::table.find(invoice_id))
    .set(invoice::line_items.eq(reduced_line_items_json))
    .execute(connection)
    .map_err(DeleteLineItemError::UnknownError)?;

  Ok(DeletedLineItem {
    invoice_id,
    line_item_key,
  })
}
