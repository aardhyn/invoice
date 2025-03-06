use crate::connection::establish_connection;
use crate::model::{InvoiceLineItems, LineItemEntity, MutableLineItemEntity};
use diesel::prelude::*;
use diesel::result::Error;
use serde::Serialize;
use std::fmt;
use uuid::Uuid;

#[derive(Debug)]
pub enum MutateLineItemError {
  ConnectionError(ConnectionError),
  UnknownError(Error),
}

impl fmt::Display for MutateLineItemError {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    write!(f, "{:?}", self)
  }
}

impl From<Error> for MutateLineItemError {
  fn from(error: Error) -> Self {
    MutateLineItemError::UnknownError(error)
  }
}

pub type MutableLineItem = MutableLineItemEntity;

#[derive(Debug, Serialize)]
pub struct MutatedLineItem {
  pub invoice_id: i32,
  pub line_item_key: Uuid,
}

pub fn mutate_line_item(
  invoice_id: i32,
  mutation: MutableLineItem,
) -> Result<MutatedLineItem, MutateLineItemError> {
  use crate::schema::invoice;

  let connection = &mut establish_connection().map_err(MutateLineItemError::ConnectionError)?;

  let invoice = invoice::table
    .find(invoice_id)
    .select(InvoiceLineItems::as_select())
    .first(connection)
    .map_err(|error| MutateLineItemError::UnknownError(error))?;

  let line_items: Vec<LineItemEntity> =
    serde_json::from_value(invoice.line_items).map_err(|error| {
      MutateLineItemError::UnknownError(Error::DeserializationError(Box::new(error)))
    })?;

  let mutated_line_items = line_items
    .into_iter()
    .map(|mut line_item_entity| {
      if line_item_entity.key != mutation.key {
        return line_item_entity;
      }

      if let Some(name) = mutation.name.clone() {
        line_item_entity.name = name;
      }
      if let Some(description) = mutation.description.clone() {
        line_item_entity.description = description;
      }
      if let Some(quantity) = mutation.quantity {
        line_item_entity.quantity = quantity;
      }
      if let Some(custom_fields) = mutation.custom_fields.clone() {
        line_item_entity.custom_fields = custom_fields;
      }

      line_item_entity
    })
    .collect::<Vec<LineItemEntity>>();

  let mutated_line_items_json = serde_json::to_value(&mutated_line_items).map_err(|error| {
    MutateLineItemError::UnknownError(Error::SerializationError(Box::new(error)))
  })?;

  diesel::update(invoice::table.find(invoice_id))
    .set(invoice::line_items.eq(mutated_line_items_json))
    .execute(connection)
    .map_err(MutateLineItemError::UnknownError)?;

  Ok(MutatedLineItem {
    invoice_id,
    line_item_key: mutation.key,
  })
}
