use std::fmt;

use crate::{
  connection::establish_connection,
  model::{CreatedLineItemEntity, InvoiceLineItems, LineItemEntity},
};

use diesel::prelude::*;
use diesel::result::Error;
use serde::{Deserialize, Serialize};

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

#[derive(Debug, Deserialize)]
pub struct CreateLineItem {
  pub invoice_id: i32,
  pub line_item: LineItemEntity,
}

#[derive(Debug, Serialize)]
pub struct CreatedLineItem {
  pub name: String,
}

pub fn add_line_item(
  CreateLineItem {
    invoice_id,
    line_item,
  }: CreateLineItem,
) -> Result<CreatedLineItem, CreateLineItemError> {
  use crate::schema::invoice;

  let connection = &mut establish_connection().map_err(CreateLineItemError::ConnectionError)?;

  let name = line_item.name.clone();

  connection.transaction::<_, CreateLineItemError, _>(|connection| {
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
      .chain(std::iter::once(LineItemEntity {
        key: line_item.key,
        name: line_item.name,
        description: line_item.description,
        // detail: line_item.detail,
      }))
      .collect::<Vec<LineItemEntity>>();

    let new_line_items_json = serde_json::to_value(&new_line_items).map_err(|error| {
      CreateLineItemError::UnknownError(Error::SerializationError(Box::new(error)))
    })?;

    diesel::update(invoice::table.find(invoice_id))
      .set(invoice::line_items.eq(new_line_items_json))
      .execute(connection)
      .map_err(CreateLineItemError::UnknownError)?;

    Ok(CreatedLineItem { name })
  })
}
