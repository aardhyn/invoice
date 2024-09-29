use crate::connection::establish_connection;
use crate::model::*;
use chrono::{DateTime, Utc};
use diesel::{prelude::*, result::Error};
use serde::Serialize;

#[derive(Serialize)]
pub struct ClientContact {
  contact_id: i32,
  name: String,
  email: String,
  cell: String,
  location: LocationEntity,
}

#[derive(Serialize)]
pub struct BusinessContact {
  contact_id: i32,
  name: String,
  email: String,
  cell: String,
}

#[derive(Serialize)]
pub struct InvoiceClient {
  client_id: i32,
  name: String,
  description: Option<String>,
  contact: ClientContact,
}

#[derive(Serialize)]
pub struct InvoiceBusiness {
  business_id: i32,
  name: String,
  description: Option<String>,
  contact: BusinessContact,
  location: LocationEntity,
}

#[derive(Serialize)]
pub struct InvoiceGet {
  invoice_id: i32,
  name: String,
  description: Option<String>,
  reference: Option<String>,
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

  // todo: join these tables in one query and then serialize into this hierarchy

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

  // todo: cause any errors after this point relate to business logic not user input, we just panic when stuff breaks...
  //       instead, lets return an "internal error" for these cases. api will log this error and return a "something went
  //       wrong" message to the user.

  let business_entity = business::table
    .find(invoice_entity.business_id)
    .select(BusinessEntity::as_select())
    .first(connection)
    .expect("Error loading business");

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
  let business_contact = BusinessContact {
    contact_id: business_contact.contact_id,
    name: business_contact.name,
    email: business_contact.email,
    cell: business_contact.cell,
  };

  let business_payment_id = business_entity
    .payment_id
    .expect("Business has no payment method");
  let payment_entity = payment::table
    .find(business_payment_id)
    .select(PaymentEntity::as_select())
    .first(connection)
    .expect("Error loading payment");

  let business = InvoiceBusiness {
    business_id: business_entity.business_id,
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
  let client_contact_location_id = client_contact_entity
    .location_id
    .expect("Client contact has no location");
  let client_contact_location = location::table
    .find(client_contact_location_id)
    .select(LocationEntity::as_select())
    .first(connection)
    .expect("Error loading client location");

  let client_contact = ClientContact {
    contact_id: client_contact_entity.contact_id,
    name: client_contact_entity.name,
    email: client_contact_entity.email,
    cell: client_contact_entity.cell,
    location: client_contact_location,
  };

  let client = InvoiceClient {
    client_id: client_entity.client_id,
    name: client_entity.name,
    description: client_entity.description,
    contact: client_contact,
  };

  // seems silly to deserialize and then serialize again in the service layer
  let line_items = serde_json::from_value(invoice_entity.line_items).unwrap();
  let invoice = InvoiceGet {
    invoice_id: invoice_entity.invoice_id,
    name: invoice_entity.name,
    reference: invoice_entity.reference,
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
