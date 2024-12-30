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
  invoice_key: String,
  name: String,
  description: Option<String>,
  reference: Option<String>,
  due_date: DateTime<Utc>,
  line_items: Vec<InvoiceLineItem>,
  payment: PaymentEntity,
  business: InvoiceBusiness,
  client: InvoiceClient,
  location: LocationEntity,
}

#[derive(Serialize)]
#[serde(untagged, rename_all = "snake_case")]
pub enum InvoiceLineItemDetail {
  Product(ProductEntity),
  Service(ServiceEntity),
}

#[derive(Serialize)]
pub struct InvoiceLineItem {
  key: String,
  name: String,
  description: String,
  custom_fields: Vec<LineItemCustomField>,
  detail: Option<InvoiceLineItemDetail>,
  quantity: i32,
}

pub enum GetInvoiceError {
  ConnectionError(ConnectionError),
  NotFound,
  UnknownError(Error),
}

pub fn get_invoice(invoice_id: i32) -> Result<InvoiceGet, GetInvoiceError> {
  use crate::schema::{business, client, contact, invoice, location, payment, product, service};

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

  let line_items = serde_json::from_value::<Vec<LineItemEntity>>(invoice_entity.line_items)
    .expect("Failed to deserialize invoice_entity::line_items");

  let detailed_items = line_items
    .into_iter()
    .map(|line_item| InvoiceLineItem {
      key: line_item.key.to_string(),
      name: line_item.name,
      description: line_item.description,
      custom_fields: line_item.custom_fields,
      detail: match line_item.detail {
        // fixme: lines items may share products or services. perhaps we should deduplicate them somehow.
        Some(LineItemDetail::Product(reference)) => {
          let product = product::table
            .find(reference.product_id)
            .select(ProductEntity::as_select())
            .first(connection)
            .expect("Failed to load product");
          Some(InvoiceLineItemDetail::Product(product))
        }
        Some(LineItemDetail::Service(service)) => {
          let service = service::table
            .find(service.service_id)
            .select(ServiceEntity::as_select())
            .first(connection)
            .expect("Failed to load service");
          Some(InvoiceLineItemDetail::Service(service))
        }
        None => None,
      },
      quantity: line_item.quantity,
    })
    .collect();

  let invoice = InvoiceGet {
    invoice_id: invoice_entity.invoice_id,
    invoice_key: invoice_entity.invoice_key,
    name: invoice_entity.name,
    reference: invoice_entity.reference,
    description: invoice_entity.description,
    due_date: invoice_entity.due_date,
    payment: payment_entity,
    line_items: detailed_items,
    business,
    client,
    location: location_entity,
  };

  Ok(invoice)
}
