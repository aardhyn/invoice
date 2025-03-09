use crate::schema::*;
use crate::utility::serialization::deserialize_optional_field;
use chrono::{DateTime, Utc};
use diesel::deserialize::{self, FromSql, FromSqlRow};
use diesel::pg::Pg;
use diesel::pg::PgValue;
use diesel::serialize::{self, IsNull, Output, ToSql};
use diesel::{AsChangeset, Insertable, Queryable, Selectable};
use serde::{Deserialize, Serialize};
use std::io::Write;
use uuid::Uuid;

// Contact //

#[derive(Queryable, Selectable, Serialize)]
#[serde(rename_all = "camelCase")]
#[diesel(check_for_backend(Pg))]
#[diesel(table_name = contact)]
pub struct ContactEntity {
  pub contact_id: i32,
  pub name: String,
  pub email: String,
  pub cell: String,
  pub address: Option<String>,
  pub suburb: Option<String>,
  pub city: Option<String>,
}
#[derive(Debug, Insertable, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[diesel(check_for_backend(Pg))]
#[diesel(table_name = contact)]
pub struct CreateContactEntity {
  pub name: String,
  pub email: String,
  pub cell: String,
  pub address: Option<String>,
  pub suburb: Option<String>,
  pub city: Option<String>,
}
#[derive(Queryable, Selectable, Serialize)]
#[serde(rename_all = "camelCase")]
#[diesel(check_for_backend(Pg))]
#[diesel(table_name = contact)]
pub struct CreatedContactEntity {
  pub contact_id: i32,
}

// Payment //

#[derive(Queryable, Selectable, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
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
#[serde(rename_all = "camelCase")]
#[diesel(check_for_backend(Pg))]
#[diesel(table_name = payment)]
pub struct CreatedPaymentEntity {
  pub payment_id: i32,
}

// Location //

#[derive(Queryable, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[diesel(check_for_backend(Pg))]
pub struct LocationEntity {
  pub address: Option<String>,
  pub suburb: Option<String>,
  pub city: Option<String>,
}

// Business //

#[derive(Queryable, Selectable, Serialize)]
#[serde(rename_all = "camelCase")]
#[diesel(check_for_backend(Pg))]
#[diesel(table_name = business)]
pub struct BusinessEntity {
  pub business_id: i32,
  pub name: String,
  pub description: Option<String>,
  pub address: Option<String>,
  pub suburb: Option<String>,
  pub city: Option<String>,
  pub payment_id: Option<i32>,
  pub contact_id: Option<i32>,
}
#[derive(Insertable, Debug)]
#[diesel(check_for_backend(Pg))]
#[diesel(table_name = business)]
pub struct NewBusinessEntity {
  pub name: String,
  pub description: Option<String>,
  pub address: Option<String>,
  pub suburb: Option<String>,
  pub city: Option<String>,
  pub payment_id: Option<i32>,
  pub contact_id: Option<i32>,
}
#[derive(Queryable, Selectable, Serialize)]
#[serde(rename_all = "camelCase")]
#[diesel(check_for_backend(Pg))]
#[diesel(table_name = business)]
pub struct CreatedBusinessEntity {
  pub business_id: i32,
  pub name: String,
}

#[derive(Debug, Queryable, Selectable, Serialize)]
#[serde(rename_all = "camelCase")]
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
  pub name: String,
  pub description: Option<String>,
  pub contact_id: i32,
  pub business_id: i32,
}

#[derive(Debug, Insertable, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[diesel(check_for_backend(Pg))]
#[diesel(table_name = client)]
pub struct CreateClientEntity {
  pub name: String,
  pub description: Option<String>,
  pub contact_id: i32,
  pub business_id: i32,
}

#[derive(Queryable, Selectable, Serialize)]
#[serde(rename_all = "camelCase")]
#[diesel(check_for_backend(Pg))]
#[diesel(table_name = client)]
pub struct CreatedClientEntity {
  pub client_id: i32,
  pub name: String,
}

#[derive(Debug, Queryable, Selectable, Serialize)]
#[serde(rename_all = "camelCase")]
#[diesel(check_for_backend(Pg))]
#[diesel(table_name = client)]
pub struct ClientEntityListItem {
  pub client_id: i32,
  pub name: String,
}

// Service //

#[derive(Debug, Deserialize, Queryable, Selectable, Serialize)]
#[serde(rename_all = "camelCase")]
#[diesel(check_for_backend(Pg))]
#[diesel(table_name = service)]
pub struct ServiceEntity {
  pub service_id: i32,
  pub name: String,
  pub description: Option<String>,
  pub business_id: i32,
  pub initial_rate: i32,
  pub initial_rate_threshold: i32,
  pub rate: i32,
}

#[derive(Insertable, Deserialize)]
#[serde(rename_all = "camelCase")]
#[diesel(check_for_backend(Pg))]
#[diesel(table_name = service)]
pub struct NewServiceEntity {
  pub name: String,
  pub description: Option<String>,
  pub business_id: i32,
  pub initial_rate: Option<i32>,
  pub initial_rate_threshold: Option<i32>,
  pub rate: i32,
}

#[derive(Queryable, Selectable, Serialize)]
#[serde(rename_all = "camelCase")]
#[diesel(check_for_backend(Pg))]
#[diesel(table_name = service)]
pub struct CreatedServiceEntity {
  pub service_id: i32,
  pub name: String,
}

#[derive(Debug, Queryable, Selectable, Serialize)]
#[serde(rename_all = "camelCase")]
#[diesel(check_for_backend(Pg))]
#[diesel(table_name = service)]
pub struct ServiceEntityListItem {
  pub service_id: i32,
  pub name: String,
}

// Product //

#[derive(Debug, Deserialize, Queryable, Selectable, Serialize)]
#[serde(rename_all = "camelCase")]
#[diesel(check_for_backend(Pg))]
#[diesel(table_name = product)]
pub struct ProductEntity {
  pub product_id: i32,
  pub name: String,
  pub description: Option<String>,
  pub business_id: i32,
  pub unit_cost: i32,
}

#[derive(Insertable, Deserialize)]
#[serde(rename_all = "camelCase")]
#[diesel(check_for_backend(Pg))]
#[diesel(table_name = product)]
pub struct NewProductEntity {
  pub name: String,
  pub description: Option<String>,
  pub business_id: i32,
  pub unit_cost: i32,
}

#[derive(Queryable, Selectable, Serialize)]
#[serde(rename_all = "camelCase")]
#[diesel(check_for_backend(Pg))]
#[diesel(table_name = product)]
pub struct CreatedProductEntity {
  pub product_id: i32,
  pub name: String,
}

#[derive(Debug, Queryable, Selectable, Serialize)]
#[serde(rename_all = "camelCase")]
#[diesel(check_for_backend(Pg))]
#[diesel(table_name = product)]
pub struct ProductEntityListItem {
  pub product_id: i32,
  pub name: String,
}

// Line Item //

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(untagged)]
pub enum LineItemCustomFieldType {
  String(String),
  Integer(i32),
  Float(f32),
  Boolean(bool),
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ServiceLineItemEntity {
  pub service_id: i32,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ProductLineItemEntity {
  pub product_id: i32,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(untagged)]
pub enum LineItemDetail {
  Service(ServiceLineItemEntity),
  Product(ProductLineItemEntity),
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct LineItemCustomField {
  pub key: Uuid,
  pub name: String,
  pub data: LineItemCustomFieldType,
}

#[derive(Debug, Serialize, Deserialize, FromSqlRow)]
#[serde(rename_all = "camelCase")]
pub struct LineItemEntity {
  pub key: Uuid,
  pub name: String,
  pub description: String,
  pub custom_fields: Vec<LineItemCustomField>,
  pub detail: Option<LineItemDetail>,
  pub quantity: i32,
}

#[derive(Default, Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(default)]
pub struct MutableLineItemEntity {
  pub key: Uuid,
  pub name: Option<String>,
  pub description: Option<String>,
  pub custom_fields: Option<Vec<LineItemCustomField>>,
  #[serde(deserialize_with = "deserialize_optional_field")]
  #[serde(skip_serializing_if = "Option::is_none")]
  pub detail: Option<Option<LineItemDetail>>,
  pub quantity: Option<i32>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct CreatedLineItemEntity {
  pub key: Uuid,
  pub name: String,
}

// Invoice //

#[derive(Debug, FromSqlRow, PartialEq, Serialize)]
#[serde(rename_all = "camelCase")]
#[diesel(sql_type = sql_types::InvoiceState)]
pub enum InvoiceState {
  Draft,
  Sent,
  Paid,
}

impl ToSql<sql_types::InvoiceState, Pg> for InvoiceState {
  fn to_sql<'b>(&'b self, out: &mut Output<'b, '_, Pg>) -> serialize::Result {
    match *self {
      InvoiceState::Draft => out.write_all(b"draft")?,
      InvoiceState::Sent => out.write_all(b"sent")?,
      InvoiceState::Paid => out.write_all(b"paid")?,
    }
    Ok(IsNull::No)
  }
}

impl FromSql<sql_types::InvoiceState, Pg> for InvoiceState {
  fn from_sql(bytes: PgValue<'_>) -> deserialize::Result<Self> {
    match bytes.as_bytes() {
      b"draft" => Ok(InvoiceState::Draft),
      b"sent" => Ok(InvoiceState::Sent),
      b"paid" => Ok(InvoiceState::Paid),
      _ => Err("Invalid Invoice State ".into()),
    }
  }
}

#[derive(Queryable, Selectable)]
#[diesel(check_for_backend(Pg))]
#[diesel(table_name = invoice)]
pub struct InvoiceEntity {
  pub invoice_id: i32,
  pub invoice_key: String,
  pub name: String,
  pub description: Option<String>,
  pub reference: Option<String>,
  pub business_id: i32,
  pub client_id: Option<i32>,
  pub address: Option<String>,
  pub suburb: Option<String>,
  pub city: Option<String>,
  pub due_date: Option<DateTime<Utc>>,
  pub line_items: serde_json::Value, //Vec<LineItemEntity>,
  pub state: InvoiceState,
}

#[derive(Insertable, Queryable, Selectable, Debug)]
#[diesel(check_for_backend(Pg))]
#[diesel(table_name = invoice)]
pub struct DuplicateInvoiceEntity {
  pub invoice_key: String,
  pub name: String,
  pub description: Option<String>,
  pub reference: Option<String>,
  pub business_id: i32,
  pub client_id: Option<i32>,
  pub address: Option<String>,
  pub suburb: Option<String>,
  pub city: Option<String>,
  pub line_items: serde_json::Value, //Vec<LineItemEntity>,
}

#[derive(Insertable, Queryable, Selectable, Debug)]
#[diesel(check_for_backend(Pg))]
#[diesel(table_name = invoice)]
pub struct NewInvoiceEntity {
  pub invoice_key: String,
  pub business_id: i32,
  pub name: String,
}

#[derive(Debug, Queryable, AsChangeset, Deserialize)]
#[serde(rename_all = "camelCase")]
#[diesel(check_for_backend(Pg))]
#[diesel(table_name = invoice)]
pub struct DraftInvoiceEntityMutation {
  pub name: Option<String>,
  pub description: Option<String>,
  pub reference: Option<String>,
  pub address: Option<String>,
  pub suburb: Option<String>,
  pub city: Option<String>,
  pub client_id: Option<i32>,
  pub due_date: Option<DateTime<Utc>>,
}

#[derive(Queryable, Selectable, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
#[diesel(check_for_backend(Pg))]
#[diesel(table_name = invoice)]
pub struct CreatedInvoiceEntity {
  pub invoice_id: i32,
  pub name: String,
}

pub type DuplicatedInvoiceEntity = CreatedInvoiceEntity;

#[derive(Debug, Serialize, Queryable, Selectable)]
#[serde(rename_all = "camelCase")]
#[diesel(check_for_backend(Pg))]
#[diesel(table_name = invoice)]
pub struct InvoiceEntityListItem {
  pub invoice_id: i32,
  pub name: String,
  pub description: Option<String>,
  pub due_date: Option<DateTime<Utc>>,
}

#[derive(Debug, Queryable, Selectable)]
#[diesel(check_for_backend(Pg))]
#[diesel(table_name = invoice)]
pub struct InvoiceLineItems {
  pub line_items: serde_json::Value,
}

// Invoice Template //

#[derive(Queryable, Selectable, Serialize)]
#[serde(rename_all = "camelCase")]
#[diesel(check_for_backend(Pg))]
#[diesel(belongs_to(InvoiceEntity))]
#[diesel(table_name = invoice_template)]
pub struct InvoiceTemplateEntity {
  pub invoice_id: i32,
}

#[derive(Insertable, Deserialize)]
#[serde(rename_all = "camelCase")]
#[diesel(check_for_backend(Pg))]
#[diesel(table_name = invoice_template)]
pub struct NewInvoiceTemplateEntity {
  pub invoice_id: i32,
}

#[derive(Queryable, Serialize)]
#[serde(rename_all = "camelCase")]
#[diesel(check_for_backend(Pg))]
pub struct InvoiceTemplateListEntity {
  pub invoice_id: i32,
  pub name: String,
  pub description: Option<String>,
  pub address: Option<String>,
  pub suburb: Option<String>,
  pub city: Option<String>,
  pub client_name: Option<String>,
}

pub type CreatedInvoiceTemplateEntity = InvoiceTemplateEntity;
