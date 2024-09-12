use std::fmt;

use chrono::{DateTime, Utc};
use diesel::result::Error;
use diesel::{ConnectionError, SelectableHelper};
use serde::{Deserialize, Serialize};

use crate::connection::establish_connection;
use crate::model::*;

use diesel::prelude::*;

use super::common::CreateLocation;

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
  pub name: String,
  pub description: Option<String>,
  pub due_date: DateTime<Utc>,

  pub location: CreateLocation,
  pub business_id: i32,
  pub client_id: i32,
}

#[derive(Debug, Deserialize)]
pub struct FilterInvoice {}

#[derive(Debug, Serialize)]
pub struct CreatedInvoice {
  pub invoice_id: i32,
  pub name: String,
}

pub fn create_invoice(new_invoice: CreateInvoice) -> Result<CreatedInvoice, CreateInvoiceError> {
  use crate::schema::{invoice, location};

  let connection = &mut establish_connection().map_err(CreateInvoiceError::ConnectionError)?;

  connection.transaction::<_, CreateInvoiceError, _>(|connection| {
    let created_location = diesel::insert_into(location::table)
      .values(&NewLocationEntity {
        address: new_invoice.location.address.clone(),
        suburb: new_invoice.location.suburb.clone(),
        city: new_invoice.location.city.clone(),
      })
      .returning(CreatedLocationEntity::as_returning())
      .get_result(connection)?;

    let created_invoice = diesel::insert_into(invoice::table)
      .values(&NewInvoiceEntity {
        name: new_invoice.name.clone(),
        description: new_invoice.description,
        due_date: new_invoice.due_date,

        business_id: new_invoice.business_id.clone(),
        client_id: new_invoice.client_id.clone(),
        location_id: created_location.location_id,

        payment_data: serde_json::Value::Null,
        client_data: serde_json::Value::Null,
        location_data: serde_json::Value::Null,

        line_items: serde_json::Value::Null,
      })
      .returning(CreatedInvoiceEntity::as_returning())
      .get_result(connection)
      .map_err(CreateInvoiceError::UnknownError)?;

    Ok(CreatedInvoice {
      invoice_id: created_invoice.invoice_id,
      name: created_invoice.name,
    })
  })
}
