use crate::connection::establish_connection;
use crate::model::{InvoiceLineItems, LineItemEntity};
use diesel::prelude::*;
use diesel::result::Error;
use serde::Serialize;
use std::fmt;
use uuid::Uuid;

#[derive(Debug)]
pub enum CreateLineItemError {
  ConnectionError(ConnectionError),
  UnknownError(Error),
}

impl fmt::Display for CreateLineItemError {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    write!(f, "{:?}", self)
  }
}

impl From<Error> for CreateLineItemError {
  fn from(error: Error) -> Self {
    CreateLineItemError::UnknownError(error)
  }
}

pub type CreateLineItem = LineItemEntity;

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct CreatedLineItem {
  pub invoice_id: i32,
  pub line_item_key: Uuid,
}

pub fn create_line_item(
  invoice_id: i32,
  line_item: CreateLineItem,
) -> Result<CreatedLineItem, CreateLineItemError> {
  use crate::schema::invoice;

  let connection = &mut establish_connection().map_err(CreateLineItemError::ConnectionError)?;

  let line_item_key = line_item.key.clone();

  let invoice = invoice::table
    .find(invoice_id)
    .select(InvoiceLineItems::as_select())
    .first(connection)
    .map_err(|error| CreateLineItemError::UnknownError(error))?;

  let line_items: Vec<LineItemEntity> =
    serde_json::from_value(invoice.line_items).map_err(|error| {
      CreateLineItemError::UnknownError(Error::DeserializationError(Box::new(error)))
    })?;

  let new_line_items = line_items
    .into_iter()
    .chain(std::iter::once(line_item))
    .collect::<Vec<LineItemEntity>>();

  let new_line_items_json = serde_json::to_value(&new_line_items).map_err(|error| {
    CreateLineItemError::UnknownError(Error::SerializationError(Box::new(error)))
  })?;

  diesel::update(invoice::table.find(invoice_id))
    .set(invoice::line_items.eq(new_line_items_json))
    .execute(connection)
    .map_err(CreateLineItemError::UnknownError)?;

  Ok(CreatedLineItem {
    invoice_id,
    line_item_key,
  })
}
