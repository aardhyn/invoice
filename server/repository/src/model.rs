use crate::schema::*;
use chrono::{DateTime, Utc};
use diesel::{pg::Pg, prelude::*};
use serde::{Deserialize, Serialize};
use uuid;

//
// Repository Model
//
// Mapping between the database schema and the Rust type system
//

// Location //

#[derive(Queryable, Selectable, Serialize)]
#[diesel(check_for_backend(Pg))]
#[diesel(table_name = location)]
pub struct LocationEntity {
  pub location_id: i32,
  pub address: String,
  pub suburb: Option<String>,
  pub city: String,
}
#[derive(Insertable, Deserialize)]
#[diesel(check_for_backend(Pg))]
#[diesel(table_name = location)]
pub struct NewLocationEntity {
  pub address: String,
  pub suburb: Option<String>,
  pub city: String,
}
#[derive(Queryable, Selectable, Serialize)]
#[diesel(check_for_backend(Pg))]
#[diesel(table_name = location)]
pub struct CreatedLocationEntity {
  pub location_id: i32,
}

// Contact //

#[derive(Queryable, Selectable, Serialize)]
#[diesel(check_for_backend(Pg))]
#[diesel(table_name = contact)]
pub struct ContactEntity {
  pub contact_id: i32,
  pub location_id: Option<i32>,
  pub name: String,
  pub email: String,
  pub cell: String,
}
#[derive(Insertable)]
#[diesel(check_for_backend(Pg))]
#[diesel(table_name = contact)]
pub struct NewContactEntity {
  pub location_id: Option<i32>,
  pub name: String,
  pub email: String,
  pub cell: String,
}
#[derive(Queryable, Selectable, Serialize)]
#[diesel(check_for_backend(Pg))]
#[diesel(table_name = contact)]
pub struct CreatedContactEntity {
  pub contact_id: i32,
}

// Payment //

#[derive(Queryable, Selectable, Serialize, Deserialize)]
#[diesel(check_for_backend(Pg))]
#[diesel(table_name = payment)]
pub struct PaymentEntity {
  pub payment_id: i32,
  pub account_number: String,
  pub account_name: String,
}
#[derive(Insertable)]
#[diesel(check_for_backend(Pg))]
#[diesel(table_name = payment)]
pub struct NewPaymentEntity {
  pub account_number: String,
  pub account_name: String,
}
#[derive(Queryable, Selectable, Serialize)]
#[diesel(check_for_backend(Pg))]
#[diesel(table_name = payment)]
pub struct CreatedPaymentEntity {
  pub payment_id: i32,
}

// Business //

#[derive(Queryable, Selectable, Serialize)]
#[diesel(check_for_backend(Pg))]
#[diesel(table_name = business)]
pub struct BusinessEntity {
  pub business_id: i32,
  pub payment_id: Option<i32>,
  pub contact_id: Option<i32>,
  pub location_id: Option<i32>,
  pub name: String,
  pub description: Option<String>,
}
#[derive(Insertable, Debug)]
#[diesel(check_for_backend(Pg))]
#[diesel(table_name = business)]
pub struct NewBusinessEntity {
  pub payment_id: Option<i32>,
  pub contact_id: Option<i32>,
  pub location_id: Option<i32>,
  pub name: String,
  pub description: Option<String>,
}
#[derive(Queryable, Selectable, Serialize)]
#[diesel(check_for_backend(Pg))]
#[diesel(table_name = business)]
pub struct CreatedBusinessEntity {
  pub business_id: i32,
  pub name: String,
}

#[derive(Debug, Queryable, Selectable, Serialize)]
#[diesel(check_for_backend(Pg))]
#[diesel(table_name = business)]
pub struct BusinessEntityListItem {
  pub business_id: i32,
  pub name: String,
}

// Client //

#[derive(Queryable, Selectable, Serialize)]
#[diesel(check_for_backend(Pg))]
#[diesel(table_name = client)]
pub struct ClientEntity {
  pub client_id: i32,
  pub contact_id: i32,
  pub name: String,
  pub description: Option<String>,
}

#[derive(Insertable, Serialize)]
#[diesel(check_for_backend(Pg))]
#[diesel(table_name = client)]
pub struct NewClientEntity {
  pub contact_id: i32,
  pub name: String,
  pub description: Option<String>,
}

#[derive(Queryable, Selectable, Serialize)]
#[diesel(check_for_backend(Pg))]
#[diesel(table_name = client)]
pub struct CreatedClientEntity {
  pub client_id: i32,
  pub name: String,
}

#[derive(Debug, Queryable, Selectable, Serialize)]
#[diesel(check_for_backend(Pg))]
#[diesel(table_name = client)]
pub struct ClientEntityListItem {
  pub client_id: i32,
  pub name: String,
}

// Service //

#[derive(Debug, Deserialize, Queryable, Selectable, Serialize)]
#[diesel(check_for_backend(Pg))]
#[diesel(table_name = service)]
pub struct ServiceEntity {
  pub service_id: i32,
  pub name: String,
  pub description: Option<String>,
  pub initial_rate: i32,
  pub initial_rate_threshold: i32,
  pub rate: i32,
}

#[derive(Insertable, Deserialize)]
#[diesel(check_for_backend(Pg))]
#[diesel(table_name = service)]
pub struct NewServiceEntity {
  pub name: String,
  pub description: Option<String>,
  pub initial_rate: Option<i32>,
  pub initial_rate_threshold: Option<i32>,
  pub rate: i32,
}

#[derive(Queryable, Selectable, Serialize)]
#[diesel(check_for_backend(Pg))]
#[diesel(table_name = service)]
pub struct CreatedServiceEntity {
  pub service_id: i32,
  pub name: String,
}

#[derive(Debug, Queryable, Selectable, Serialize)]
#[diesel(check_for_backend(Pg))]
#[diesel(table_name = service)]
pub struct ServiceEntityListItem {
  pub service_id: i32,
  pub name: String,
}

// Product //

#[derive(Debug, Deserialize, Queryable, Selectable, Serialize)]
#[diesel(check_for_backend(Pg))]
#[diesel(table_name = product)]
pub struct ProductEntity {
  pub product_id: i32,
  pub name: String,
  pub description: Option<String>,
  pub price: i32,
}

#[derive(Insertable, Deserialize)]
#[diesel(check_for_backend(Pg))]
#[diesel(table_name = product)]
pub struct NewProductEntity {
  pub name: String,
  pub description: Option<String>,
  pub price: i32,
}

#[derive(Queryable, Selectable, Serialize)]
#[diesel(check_for_backend(Pg))]
#[diesel(table_name = product)]
pub struct CreatedProductEntity {
  pub product_id: i32,
  pub name: String,
}

#[derive(Debug, Queryable, Selectable, Serialize)]
#[diesel(check_for_backend(Pg))]
#[diesel(table_name = product)]
pub struct ProductEntityListItem {
  pub product_id: i32,
  pub name: String,
}

// Line Item //

#[derive(Debug, Serialize, Deserialize)]
#[serde(untagged)]
pub enum LineItemCustomFieldType {
  String(String),
  Number(i32),
  Boolean(bool),
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ServiceLineItemEntity {
  pub service_id: i32,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ProductLineItemEntity {
  pub product_id: i32,
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(untagged)]
pub enum LineItemDetail {
  Service(ServiceLineItemEntity),
  Product(ProductLineItemEntity),
}

#[derive(Debug, Serialize, Deserialize)]
pub struct LineItemCustomField {
  pub key: String,
  pub name: String,
  pub data: LineItemCustomFieldType,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct LineItemEntity {
  pub key: uuid::Uuid,
  pub name: String,
  pub description: String,
  pub custom_fields: Vec<LineItemCustomField>,
  pub detail: Option<LineItemDetail>,
  pub quantity: i32,
}

#[derive(Debug, Serialize)]
pub struct CreatedLineItemEntity {
  pub key: uuid::Uuid,
  pub name: String,
}

// Invoice //

#[derive(Queryable, Selectable, QueryableByName, Serialize)]
#[diesel(check_for_backend(Pg))]
#[diesel(table_name = invoice)]
pub struct InvoiceEntity {
  pub invoice_id: i32,
  pub invoice_key: String,
  pub name: String,
  pub description: Option<String>,
  pub reference: Option<String>,
  pub due_date: DateTime<Utc>,
  pub payment_data: serde_json::Value,
  pub business_id: i32,
  pub client_id: i32,
  pub client_data: serde_json::Value,
  pub line_items: serde_json::Value, // todo: can we map this directly to a struct?
  pub location_id: i32,
  pub location_data: serde_json::Value,
}

#[derive(Insertable, Debug)]
#[diesel(check_for_backend(Pg))]
#[diesel(table_name = invoice)]
pub struct NewInvoiceEntity {
  pub name: String,
  pub invoice_key: String,
  pub description: Option<String>,
  pub reference: Option<String>,
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
#[diesel(check_for_backend(Pg))]
#[diesel(table_name = invoice)]
pub struct CreatedInvoiceEntity {
  pub invoice_id: i32,
  pub name: String,
}

#[derive(Debug, Serialize, Queryable, Selectable)]
#[diesel(check_for_backend(Pg))]
#[diesel(table_name = invoice)]
pub struct InvoiceEntityListItem {
  pub invoice_id: i32,
  pub name: String,
  pub description: Option<String>,
  pub due_date: DateTime<Utc>,
}

#[derive(Debug, Queryable, Selectable)]
#[diesel(check_for_backend(Pg))]
#[diesel(table_name = invoice)]
pub struct InvoiceLineItems {
  pub line_items: serde_json::Value,
}
