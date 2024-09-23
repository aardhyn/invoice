use crate::connection::establish_connection;
use crate::model::*;
use chrono::{DateTime, Utc};
use diesel::{prelude::*, result::Error};
use serde::Serialize;

#[derive(Serialize)]
pub struct InvoiceClient {
  name: String,
  description: Option<String>,
  contact: ContactEntity,
  location: LocationEntity,
}

#[derive(Serialize)]
pub struct InvoiceBusiness {
  name: String,
  description: Option<String>,
  contact: ContactEntity,
  location: LocationEntity,
}

#[derive(Serialize)]
pub struct InvoiceGet {
  invoice_id: i32,
  name: String,
  description: Option<String>,
  due_date: DateTime<Utc>,
  line_items: Vec<LineItemEntity>,
  payment: PaymentEntity,
  business: InvoiceBusiness,
  client: InvoiceClient,
  location: LocationEntity,
}

pub enum GetInvoiceError {
  ConnectionError(ConnectionError),
  NotFound,
  UnknownError(Error),
}

pub fn get_invoice(invoice_id: i32) -> Result<InvoiceGet, GetInvoiceError> {
  use crate::schema::{business, client, contact, invoice, location, payment};

  let connection = &mut establish_connection().expect("Error connecting to database");

  // todo: when the invoice moved out of draft state we hardcode the payment, client,
  // and location data and skip these joins bar business

  let invoice_entity = invoice::table
    .find(invoice_id)
    .select(InvoiceEntity::as_select())
    .first(connection)
    .map_err(|error| {
      if error == Error::NotFound {
        GetInvoiceError::NotFound
      } else {
        GetInvoiceError::UnknownError(error)
      }
    })?;

  let business_entity = business::table
    .find(invoice_entity.business_id)
    .select(BusinessEntity::as_select())
    .first(connection)
    .expect("Error loading business"); // todo: introduce "internal error" for these cases where the error is not user facing

  let business_contact_id = business_entity.contact_id.expect("Business has no contact");
  let business_contact = contact::table
    .find(business_contact_id)
    .select(ContactEntity::as_select())
    .first(connection)
    .expect("Error loading business contact");

  let business_location_id = business_entity
    .location_id
    .expect("Business contact has no location");
  let business_location = location::table
    .find(business_location_id)
    .select(LocationEntity::as_select())
    .first(connection)
    .expect("Error loading business location");

  let business_payment_id = business_entity
    .payment_id
    .expect("Business has no payment method");
  let payment_entity = payment::table
    .find(business_payment_id)
    .select(PaymentEntity::as_select())
    .first(connection)
    .expect("Error loading payment");

  let business = InvoiceBusiness {
    name: business_entity.name,
    description: business_entity.description,
    contact: business_contact,
    location: business_location,
  };

  let location_entity = location::table
    .find(invoice_entity.location_id)
    .select(LocationEntity::as_select())
    .first(connection)
    .expect("Error loading location");

  let client_entity = client::table
    .find(invoice_entity.client_id)
    .select(ClientEntity::as_select())
    .first(connection)
    .expect("Error loading client");

  let client_contact_entity = contact::table
    .find(client_entity.contact_id)
    .select(ContactEntity::as_select())
    .first(connection)
    .expect("Error loading client location");

  let client_location_entity = location::table
    .find(client_contact_entity.location_id)
    .select(LocationEntity::as_select())
    .first(connection)
    .expect("Error loading client location");

  let client = InvoiceClient {
    name: client_entity.name,
    description: client_entity.description,
    contact: client_contact_entity,
    location: client_location_entity,
  };

  // seems silly to deserialize and then serialize again in the service layer
  let line_items = serde_json::from_value(invoice_entity.line_items).unwrap();
  let invoice = InvoiceGet {
    invoice_id: invoice_entity.invoice_id,
    name: invoice_entity.name,
    description: invoice_entity.description,
    due_date: invoice_entity.due_date,
    payment: payment_entity,
    line_items,
    business,
    client,
    location: location_entity,
  };

  Ok(invoice)
}
