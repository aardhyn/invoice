use crate::model::{
  CreatedBusinessEntity, CreatedClientEntity, CreatedContactEntity, CreatedInvoiceEntity,
  CreatedPaymentEntity, CreatedProductEntity, CreatedServiceEntity,
};
use crate::service::create_line_item;
use crate::{connection::establish_connection, data::*};
use diesel::prelude::*;
use diesel::result::Error;
use serde::Serialize;

use super::CreatedLineItem;

pub enum SeedError {
  AlreadySeeded,
  UnknownError(String),
  ConnectionError(String),
}

#[derive(Serialize)]
pub struct SeedResult {
  businesses: Vec<CreatedBusinessEntity>,
  contacts: Vec<CreatedContactEntity>,
  payments: Vec<CreatedPaymentEntity>,
  clients: Vec<CreatedClientEntity>,
  products: Vec<CreatedProductEntity>,
  services: Vec<CreatedServiceEntity>,
  invoices: Vec<CreatedInvoiceEntity>,
  line_items: Vec<CreatedLineItem>,
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
  println!("seeded payments");

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

  let products = diesel::insert_into(product::table)
    .values(seed_product())
    .returning(CreatedProductEntity::as_returning())
    .get_results(connection)
    .map_err(SeedError::from)?;

  let services = diesel::insert_into(service::table)
    .values(seed_service())
    .returning(CreatedServiceEntity::as_returning())
    .get_results(connection)
    .map_err(SeedError::from)?;

  let invoices = diesel::insert_into(invoice::table)
    .values(seed_invoice())
    .returning(CreatedInvoiceEntity::as_returning())
    .get_results(connection)
    .map_err(SeedError::from)?;

  let line_items = seed_line_items()
    .into_iter()
    .enumerate()
    .flat_map(|(index, line_items)| {
      let invoice_id = (index + 1) as i32;
      line_items.into_iter().map(move |line_item| {
        create_line_item(invoice_id, line_item).expect("error creating line_item")
      })
    })
    .collect::<Vec<CreatedLineItem>>();

  Ok(SeedResult {
    businesses,
    contacts,
    payments,
    clients,
    products,
    services,
    invoices,
    line_items,
  })
}
