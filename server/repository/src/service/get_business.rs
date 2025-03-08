use crate::connection::establish_connection;
use crate::model::*;
use crate::utility::contact::Contact;
use crate::utility::location::Location;
use diesel::{prelude::*, result::Error};
use serde::Serialize;

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Business {
  business_id: i32,
  name: String,
  description: Option<String>,
  contact: Contact,
  location: Option<Location>,
  payment: PaymentEntity,
}

pub enum GetBusinessError {
  ConnectionError(ConnectionError),
  NotFound,
  UnknownError(Error),
}

pub fn get_business(business_id: i32) -> Result<Business, GetBusinessError> {
  use crate::schema::{business, contact, payment};

  let connection = &mut establish_connection().expect("Error connecting to database");

  let business_entity = business::table
    .find(business_id)
    .select(BusinessEntity::as_select())
    .first(connection)
    .map_err(|error| match error {
      Error::NotFound => GetBusinessError::NotFound,
      _ => GetBusinessError::UnknownError(error),
    })?;

  let business_contact_id = business_entity.contact_id.expect("Business has no contact");
  let business_contact = contact::table
    .find(business_contact_id)
    .select(ContactEntity::as_select())
    .first(connection)
    .expect("Error loading business contact");
  let contact = Contact {
    contact_id: business_contact.contact_id,
    name: business_contact.name,
    email: business_contact.email,
    cell: business_contact.cell,
    location: None,
  };

  let business_payment_id = business_entity
    .payment_id
    .expect("Business has no payment method");
  let payment = payment::table
    .find(business_payment_id)
    .select(PaymentEntity::as_select())
    .first(connection)
    .expect("Error loading payment");

  let location = Location::from_entity(LocationEntity {
    address: business_entity.address,
    suburb: business_entity.suburb,
    city: business_entity.city,
  });

  let business = Business {
    business_id: business_entity.business_id,
    name: business_entity.name,
    description: business_entity.description,
    contact,
    location,
    payment,
  };

  Ok(business)
}
