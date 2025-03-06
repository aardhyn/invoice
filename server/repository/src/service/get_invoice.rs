use crate::connection::establish_connection;
use crate::model::*;
use crate::utility::client::Client;
use crate::utility::contact::Contact;
use crate::utility::line_item::{compute_product_total, compute_service_total};
use crate::utility::location::Location;
use chrono::{DateTime, Utc};
use diesel::{prelude::*, result::Error};
use serde::Serialize;

#[derive(Serialize)]
pub struct InvoiceBusiness {
  business_id: i32,
  name: String,
  description: Option<String>,
  contact: Contact,
  location: Option<Location>,
  payment: PaymentEntity,
}

#[derive(Serialize)]
pub struct Invoice {
  invoice_id: i32,
  invoice_key: String,
  name: String,
  description: Option<String>,
  reference: Option<String>,
  due_date: Option<DateTime<Utc>>,
  line_items: Vec<InvoiceLineItem>,
  business: InvoiceBusiness,
  client: Option<Client>,
  location: Option<Location>,
  state: InvoiceState,
  total: i32,
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
  total: i32,
}
pub enum GetInvoiceError {
  ConnectionError(ConnectionError),
  NotFound,
  UnknownError(Error),
}

pub fn get_invoice(invoice_id: i32) -> Result<Invoice, GetInvoiceError> {
  use crate::schema::{business, client, contact, invoice, payment, product, service};

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
  let business_contact = Contact {
    contact_id: business_contact.contact_id,
    name: business_contact.name,
    email: business_contact.email,
    cell: business_contact.cell,
    location: Location::from_entity(LocationEntity {
      address: business_contact.address,
      suburb: business_contact.suburb,
      city: business_contact.city,
    }),
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
    location: Location::from_entity(LocationEntity {
      address: business_entity.address,
      suburb: business_entity.suburb,
      city: business_entity.city,
    }),
    payment: payment_entity,
  };

  let client = invoice_entity
    .client_id
    .map(|client_id| {
      client::table
        .find(client_id)
        .select(ClientEntity::as_select())
        .first(connection)
        .expect("Failed to get client")
    })
    .map(|client_entity| {
      let client_contact_entity = contact::table
        .find(client_entity.contact_id)
        .select(ContactEntity::as_select())
        .first(connection)
        .expect("Failed to get client contact");

      let contact = Contact {
        contact_id: client_contact_entity.contact_id,
        name: client_contact_entity.name,
        email: client_contact_entity.email,
        cell: client_contact_entity.cell,
        location: None,
      };

      Client {
        client_id: client_entity.client_id,
        name: client_entity.name,
        description: client_entity.description,
        contact,
      }
    });

  let line_items = serde_json::from_value::<Vec<LineItemEntity>>(invoice_entity.line_items)
    .expect("Failed to deserialize invoice_entity::line_items");

  let mut grand_total = 0;
  let detailed_items = line_items
    .into_iter()
    .map(|line_item| {
      let (detail, total) = match line_item.detail {
        // fixme: lines items may share products or services. We should only fetch them once.
        Some(LineItemDetail::Product(reference)) => {
          let product = product::table
            .find(reference.product_id)
            .select(ProductEntity::as_select())
            .first(connection)
            .expect("Failed to load product");
          let total = compute_product_total(&product, line_item.quantity);
          (Some(InvoiceLineItemDetail::Product(product)), total)
        }
        Some(LineItemDetail::Service(service)) => {
          let service = service::table
            .find(service.service_id)
            .select(ServiceEntity::as_select())
            .first(connection)
            .expect("Failed to load service");

          let total = compute_service_total(&service, line_item.quantity);
          (Some(InvoiceLineItemDetail::Service(service)), total)
        }
        None => (None, 0),
      };

      grand_total += total;

      InvoiceLineItem {
        key: line_item.key.to_string(),
        name: line_item.name,
        description: line_item.description,
        custom_fields: line_item.custom_fields,
        detail,
        quantity: line_item.quantity,
        total,
      }
    })
    .collect();

  let location = Location::from_entity(LocationEntity {
    address: invoice_entity.address,
    suburb: invoice_entity.suburb,
    city: invoice_entity.city,
  });

  let invoice = Invoice {
    invoice_id: invoice_entity.invoice_id,
    invoice_key: invoice_entity.invoice_key,
    name: invoice_entity.name,
    reference: invoice_entity.reference,
    description: invoice_entity.description,
    due_date: invoice_entity.due_date,
    line_items: detailed_items,
    business,
    client,
    location,
    total: grand_total,
    state: invoice_entity.state,
  };

  Ok(invoice)
}
