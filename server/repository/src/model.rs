use crate::schema::*;
use chrono::{DateTime, Utc};
use diesel::{
  prelude::*,
  sql_types::{Date, Jsonb},
};
use serde::{Deserialize, Serialize};
use uuid;

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
  pub suburb: Option<String>,
  pub city: String,
}
#[derive(Queryable, Selectable, Serialize)]
#[diesel(table_name = location)]
pub struct CreatedLocationEntity {
  pub location_id: i32,
}

// Contact //

#[derive(Queryable, Selectable)]
#[diesel(table_name = contact)]
pub struct ContactEntity {
  contact_id: i32,
  location_id: i32,
  name: String,
  email: String,
  cell: String,
}
#[derive(Insertable)]
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

#[derive(Queryable, Selectable, Serialize, Deserialize)]
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

#[derive(Queryable, Selectable, Debug)]
#[diesel(table_name = business)]
pub struct BusinessEntity {
  business_id: i32,
  pub payment_id: Option<i32>,
  pub contact_id: Option<i32>,
  pub location_id: Option<i32>,
  name: String,
  description: Option<String>,
}
#[derive(Insertable, Debug)]
#[diesel(table_name = business)]
pub struct NewBusinessEntity {
  pub payment_id: Option<i32>,
  pub contact_id: Option<i32>,
  pub location_id: Option<i32>,
  pub name: String,
  pub description: Option<String>,
}
#[derive(Queryable, Selectable, Serialize)]
#[diesel(table_name = business)]
pub struct CreatedBusinessEntity {
  pub business_id: i32,
  pub name: String,
}

#[derive(Debug, Queryable, Selectable, Serialize)]
#[diesel(table_name = business)]
pub struct BusinessEntityListItem {
  pub business_id: i32,
  pub name: String,
}

#[derive(Debug, Queryable, Selectable)]
#[diesel(table_name = business)]
pub struct BusinessPayment {
  pub business_id: i32,
  pub payment_id: Option<i32>,
}

// Client //

#[derive(Queryable, Selectable, Serialize)]
#[diesel(table_name = client)]
pub struct ClientEntity {
  client_id: i32,
  contact_id: i32,
  name: String,
  description: Option<String>,
}

#[derive(Insertable, Serialize)]
#[diesel(table_name = client)]
pub struct NewClientEntity {
  pub contact_id: i32,
  pub name: String,
  pub description: Option<String>,
}

#[derive(Queryable, Selectable, Serialize)]
#[diesel(table_name = client)]
pub struct CreatedClientEntity {
  pub client_id: i32,
  pub name: String,
}

#[derive(Debug, Queryable, Selectable, Serialize)]
#[diesel(table_name = client)]
pub struct ClientEntityListItem {
  pub client_id: i32,
  pub name: String,
}

// Line Item //

#[derive(Debug, Serialize, Deserialize)]
pub struct ProductLineItem {}

#[derive(Debug, Serialize, Deserialize)]
pub struct ServiceLineItem {}

#[derive(Debug, Serialize, Deserialize)]
pub enum LineItemType {
  Product(ProductLineItem),
  Service(ServiceLineItem),
  Custom(serde_json::Value),
}

#[derive(Debug, Serialize, Deserialize)]
pub struct LineItemEntity {
  pub key: uuid::Uuid,
  pub name: String,
  pub description: String,
  // pub detail: LineItemType,
}

#[derive(Debug, Serialize)]
pub struct CreatedLineItemEntity {
  pub name: String,
}

// Invoice //

#[derive(Queryable, Selectable)]
#[diesel(table_name = invoice)]
pub struct InvoiceEntity {
  pub invoice_id: i32,
  pub name: String,
  pub description: Option<String>,
  pub due_date: Date,
  pub payment_data: Jsonb,
  pub business_id: Option<i32>,
  pub client_id: Option<i32>,
  pub client_data: Jsonb,
  pub location_id: Option<i32>,
  pub location_data: Jsonb,
}

#[derive(Insertable, Debug)]
#[diesel(table_name = invoice)]
pub struct NewInvoiceEntity {
  pub name: String,
  pub description: Option<String>,
  pub business_id: i32,
  pub payment_data: serde_json::Value, // todo: can we map this directly to a struct?
  pub client_id: i32,
  pub client_data: serde_json::Value, // todo: can we map this directly to a struct?
  pub location_id: i32,
  pub location_data: serde_json::Value, // todo: can we map this directly to a struct?
  pub due_date: DateTime<Utc>,
  pub line_items: serde_json::Value, // todo: can we map this directly to a struct?
}

#[derive(Queryable, Selectable, Serialize)]
#[diesel(table_name = invoice)]
pub struct CreatedInvoiceEntity {
  pub invoice_id: i32,
  pub name: String,
}

#[derive(Debug, Serialize, Queryable, Selectable)]
#[diesel(table_name = invoice)]
pub struct InvoiceEntityListItem {
  pub invoice_id: i32,
  pub name: String,
  pub description: Option<String>,
  pub due_date: DateTime<Utc>,
}

#[derive(Debug, Queryable, Selectable)]
#[diesel(table_name = invoice)]
pub struct InvoiceLineItems {
  pub invoice_id: i32,
  pub line_items: serde_json::Value,
}
