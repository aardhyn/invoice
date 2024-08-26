use serde::Serialize;

use crate::{
  connection::establish_connection,
  data::*,
  model::{
    CreatedBusinessEntity, CreatedClientEntity, CreatedContactEntity, CreatedInvoiceEntity,
    CreatedLocationEntity, CreatedPaymentEntity,
  },
};

use diesel::prelude::*;
use diesel::result::Error;

pub enum SeedError {
  AlreadySeeded,
  UnknownError(String),
  ConnectionError(String),
}

#[derive(Serialize)]
pub struct SeedResult {
  businesses: Vec<CreatedBusinessEntity>,
  contacts: Vec<CreatedContactEntity>,
  locations: Vec<CreatedLocationEntity>,
  payments: Vec<CreatedPaymentEntity>,
  clients: Vec<CreatedClientEntity>,
  invoices: Vec<CreatedInvoiceEntity>,
}

impl From<Error> for SeedError {
  fn from(error: Error) -> Self {
    match error {
      diesel::result::Error::DatabaseError(
        diesel::result::DatabaseErrorKind::UniqueViolation,
        _,
      ) => SeedError::AlreadySeeded,
      _ => SeedError::UnknownError(error.to_string()),
    }
  }
}

pub fn sys_seed() -> Result<SeedResult, SeedError> {
  use crate::schema::*;

  let connection =
    &mut establish_connection().map_err(|error| SeedError::ConnectionError(error.to_string()))?;

  let payments = diesel::insert_into(payment::table)
    .values(&seed_payment())
    .returning(CreatedPaymentEntity::as_returning())
    .get_results(connection)
    .map_err(SeedError::from)?;

  let locations = diesel::insert_into(location::table)
    .values(seed_location())
    .returning(CreatedLocationEntity::as_returning())
    .get_results(connection)
    .map_err(SeedError::from)?;

  let contacts = diesel::insert_into(contact::table)
    .values(seed_contact())
    .returning(CreatedContactEntity::as_returning())
    .get_results(connection)
    .map_err(SeedError::from)?;

  let businesses = diesel::insert_into(business::table)
    .values(seed_business())
    .returning(CreatedBusinessEntity::as_returning())
    .get_results(connection)
    .map_err(SeedError::from)?;

  let clients = diesel::insert_into(client::table)
    .values(seed_client())
    .returning(CreatedClientEntity::as_returning())
    .get_results(connection)
    .map_err(SeedError::from)?;

  let invoices = diesel::insert_into(invoice::table)
    .values(seed_invoice())
    .returning(CreatedInvoiceEntity::as_returning())
    .get_results(connection)
    .map_err(SeedError::from)?;

  Ok(SeedResult {
    businesses,
    contacts,
    locations,
    payments,
    clients,
    invoices,
  })
}
