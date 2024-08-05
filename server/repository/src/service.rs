use diesel::result::Error;
use diesel::SelectableHelper;
use serde::{Deserialize, Serialize};

use crate::connection::establish_connection;
use crate::model::*;
use diesel::prelude::*;

// Create Business //

#[derive(Debug, Deserialize)]
pub struct CreateLocation {
  pub address: String,
  pub suburb: String,
  pub city: String,
}

#[derive(Debug, Deserialize)]
pub struct CreateContact {
  pub name: String,
  pub location: CreateLocation,
  pub cell: String,
  pub email: String,
}

#[derive(Debug, Deserialize)]
pub struct CreateBusiness {
  pub name: String,
  pub description: String,
  pub contact: CreateContact,
  pub location: CreateLocation,
  pub account_number: String,
  pub account_name: String,
}

#[derive(Debug, Deserialize)]
pub struct FilterBusiness {}

#[derive(Debug, Serialize)]
pub struct CreatedBusiness {
  pub business_id: i32,
  pub name: String,
}

pub fn create_business(new_business: CreateBusiness) -> Result<CreatedBusiness, String> {
  use crate::schema::{business, contact, location, payment};

  let connection = &mut establish_connection().expect("Error connecting to database");

  let transaction = connection.transaction::<_, Error, _>(|connection| {
    let created_location = diesel::insert_into(location::table)
      .values(&NewLocationEntity {
        address: new_business.location.address.clone(),
        suburb: new_business.location.suburb.clone(),
        city: new_business.location.city.clone(),
      })
      .returning(CreatedLocationEntity::as_returning())
      .get_result(connection)?;

    let created_contact_location = diesel::insert_into(location::table)
      .values(&NewLocationEntity {
        address: new_business.contact.location.address.clone(),
        suburb: new_business.contact.location.suburb.clone(),
        city: new_business.contact.location.city.clone(),
      })
      .returning(CreatedLocationEntity::as_returning())
      .get_result(connection)?;

    let created_contact = diesel::insert_into(contact::table)
      .values(&NewContactEntity {
        location_id: created_contact_location.location_id,
        name: new_business.contact.name.clone(),
        email: new_business.contact.email.clone(),
        cell: new_business.contact.cell.clone(),
      })
      .returning(CreatedContactEntity::as_returning())
      .get_result(connection)?;

    let created_payment = diesel::insert_into(payment::table)
      .values(&NewPaymentEntity {
        account_number: new_business.account_number.clone(),
        account_name: new_business.account_name.clone(),
      })
      .returning(CreatedPaymentEntity::as_returning())
      .get_result(connection)?;

    let created_business = diesel::insert_into(business::table)
      .values(&NewBusinessEntity {
        name: new_business.name.clone(),
        contact_id: Some(created_contact.contact_id),
        location_id: Some(created_location.location_id),
        payment_id: Some(created_payment.payment_id),
      })
      .returning(CreatedBusinessEntity::as_returning())
      .get_result(connection)?;

    Ok(CreatedBusiness {
      business_id: created_business.business_id,
      name: created_business.name,
    })
  });

  match transaction {
    Ok(created_business) => Ok(created_business),
    Err(e) => Err(format!("Error creating business: {:?}", e)),
  }
}

// List Businesses //

#[derive(Debug, Serialize)]
pub struct BusinessListItem {
  pub business_id: i32,
  pub name: String,
}
#[derive(Debug, Serialize)]
pub struct BusinessList {
  pub businesses: Vec<BusinessListItem>,
}

pub fn list_businesses() -> Result<BusinessList, String> {
  use crate::schema::business;

  let connection = &mut establish_connection().expect("Error connecting to database");

  let businesses = business::table
    .select(BusinessEntityListItem::as_select())
    .limit(24)
    .load(connection)
    .expect("Error loading businesses");

  Ok(BusinessList {
    businesses: businesses
      .into_iter()
      .map(|business| BusinessListItem {
        business_id: business.business_id,
        name: business.name.clone(),
      })
      .collect(),
  })
}
