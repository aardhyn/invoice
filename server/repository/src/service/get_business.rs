use crate::connection::establish_connection;
use crate::model::*;
use crate::utility::contact::BusinessContact;
use diesel::{prelude::*, result::Error};
use serde::Serialize;

#[derive(Serialize)]
pub struct Business {
  business_id: i32,
  name: String,
  description: Option<String>,
  contact: BusinessContact,
  location: LocationEntity,
  payment: PaymentEntity,
}

pub enum GetBusinessError {
  ConnectionError(ConnectionError),
  NotFound,
  UnknownError(Error),
}

pub fn get_business(business_id: i32) -> Result<Business, GetBusinessError> {
  use crate::schema::{business, contact, location, payment};

  let connection = &mut establish_connection().expect("Error connecting to database");

  let business_entity = business::table
    .find(business_id)
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

  let business = Business {
    business_id: business_entity.business_id,
    name: business_entity.name,
    description: business_entity.description,
    contact: business_contact,
    location: business_location,
    payment: payment_entity,
  };

  Ok(business)
}
