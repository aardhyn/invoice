use crate::schema::*;
use diesel::prelude::*;
use serde::{Deserialize, Serialize};

//
// Repository Model
//
// Mapping between the database schema and the Rust type system
//

// Location //

#[derive(Queryable, Selectable, Serialize)]
#[diesel(table_name = location)]
pub struct LocationEntity {
  location_id: i32,
  address: String,
  suburb: String,
  city: String,
}
#[derive(Insertable, Deserialize)]
#[diesel(table_name = location)]
pub struct NewLocationEntity {
  pub address: String,
  pub suburb: String,
  pub city: String,
}
#[derive(Queryable, Selectable, Serialize)]
#[diesel(table_name = location)]
pub struct CreatedLocationEntity {
  pub location_id: i32,
}

// Contact //

#[derive(Queryable, Selectable, Serialize)]
#[diesel(table_name = contact)]
pub struct ContactEntity {
  contact_id: i32,
  location_id: i32,
  name: String,
  email: String,
  cell: String,
}
#[derive(Insertable, Deserialize)]
#[diesel(table_name = contact)]
pub struct NewContactEntity {
  pub location_id: i32,
  pub name: String,
  pub email: String,
  pub cell: String,
}
#[derive(Queryable, Selectable, Serialize)]
#[diesel(table_name = contact)]
pub struct CreatedContactEntity {
  pub contact_id: i32,
}

// Payment //

#[derive(Queryable, Selectable, Serialize)]
#[diesel(table_name = payment)]
pub struct PaymentEntity {
  payment_id: i32,
  account_number: String,
  account_name: String,
}
#[derive(Insertable)]
#[diesel(table_name = payment)]
pub struct NewPaymentEntity {
  pub account_number: String,
  pub account_name: String,
}
#[derive(Queryable, Selectable, Serialize)]
#[diesel(table_name = payment)]
pub struct CreatedPaymentEntity {
  pub payment_id: i32,
}

// Business //

#[derive(Queryable, Selectable, Debug, Serialize)]
#[diesel(table_name = business)]
pub struct BusinessEntity {
  business_id: i32,
  pub payment_id: Option<i32>,
  pub contact_id: Option<i32>,
  pub location_id: Option<i32>,
  name: String,
}
#[derive(Insertable, Debug, Deserialize)]
#[diesel(table_name = business)]
pub struct NewBusinessEntity {
  pub payment_id: Option<i32>,
  pub contact_id: Option<i32>,
  pub location_id: Option<i32>,
  pub name: String,
}
#[derive(Queryable, Selectable, Serialize)]
#[diesel(table_name = business)]
pub struct CreatedBusinessEntity {
  pub business_id: i32,
  pub name: String,
}

#[derive(Debug, Serialize, Queryable, Selectable)]
#[diesel(table_name = business)]
pub struct BusinessEntityListItem {
  pub business_id: i32,
  pub name: String,
}
