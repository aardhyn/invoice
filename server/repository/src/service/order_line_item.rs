use crate::connection::establish_connection;
use crate::model::{InvoiceLineItems, LineItemEntity};
use diesel::prelude::*;
use diesel::result::Error;
use serde::Serialize;
use std::fmt;
use uuid::Uuid;

#[derive(Debug)]
pub enum OrderLineItemsError {
  ConnectionError(ConnectionError),
  UnknownError(Error),
}

impl fmt::Display for OrderLineItemsError {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    write!(f, "{:?}", self)
  }
}

impl From<Error> for OrderLineItemsError {
  fn from(error: Error) -> Self {
    OrderLineItemsError::UnknownError(error)
  }
}

pub type OrderLineItems = LineItemEntity;

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct OrderedLineItems {
  pub key: Uuid,
  pub name: String,
}

pub fn order_line_items(
  invoice_id: i32,
  line_item: OrderLineItems,
) -> Result<OrderedLineItems, OrderLineItemsError> {
  use crate::schema::invoice;

  let connection = &mut establish_connection().map_err(OrderLineItemsError::ConnectionError)?;

  let name = line_item.name.clone();
  let key = line_item.key.clone();

  let invoice = invoice::table
    .find(invoice_id)
    .select(InvoiceLineItems::as_select())
    .first(connection)
    .map_err(|error| OrderLineItemsError::UnknownError(error))?;

  let line_items: Vec<LineItemEntity> =
    serde_json::from_value(invoice.line_items).map_err(|error| {
      OrderLineItemsError::UnknownError(Error::DeserializationError(Box::new(error)))
    })?;

  let new_line_items = line_items
    .into_iter()
    .chain(std::iter::once(line_item))
    .collect::<Vec<LineItemEntity>>();

  let new_line_items_json = serde_json::to_value(&new_line_items).map_err(|error| {
    OrderLineItemsError::UnknownError(Error::SerializationError(Box::new(error)))
  })?;

  diesel::update(invoice::table.find(invoice_id))
    .set(invoice::line_items.eq(new_line_items_json))
    .execute(connection)
    .map_err(OrderLineItemsError::UnknownError)?;

  Ok(OrderedLineItems { name, key })
}
