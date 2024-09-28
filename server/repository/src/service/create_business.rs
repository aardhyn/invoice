use std::fmt;

use diesel::result::{DatabaseErrorKind, Error};
use diesel::SelectableHelper;
use serde::{Deserialize, Serialize};

use super::common::{CreateContact, CreateLocation};

use crate::connection::establish_connection;
use crate::model::*;
use diesel::prelude::*;

#[derive(Debug)]
pub enum CreateBusinessError {
  NonUniqueContact,
  NonUniquePayment,
  ConnectionError(ConnectionError),
  UnknownError(Error),
}

impl fmt::Display for CreateBusinessError {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    write!(f, "{:?}", self)
  }
}

impl From<Error> for CreateBusinessError {
  fn from(error: Error) -> Self {
    CreateBusinessError::UnknownError(error)
  }
}

#[derive(Debug, Deserialize)]
pub struct CreateBusiness {
  pub name: String,
  pub description: Option<String>,
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

pub fn create_business(
  new_business: CreateBusiness,
) -> Result<CreatedBusiness, CreateBusinessError> {
  use crate::schema::{business, contact, location, payment};

  let connection = &mut establish_connection().map_err(CreateBusinessError::ConnectionError)?;

  connection.transaction::<_, CreateBusinessError, _>(|connection| {
    let created_location = diesel::insert_into(location::table)
      .values(&NewLocationEntity {
        address: new_business.location.address.clone(),
        suburb: new_business.location.suburb.clone(),
        city: new_business.location.city.clone(),
      })
      .returning(CreatedLocationEntity::as_returning())
      .get_result(connection)?;

    let created_contact = diesel::insert_into(contact::table)
      .values(&NewContactEntity {
        location_id: None,
        name: new_business.contact.name.clone(),
        email: new_business.contact.email.clone(),
        cell: new_business.contact.cell.clone(),
      })
      .returning(CreatedContactEntity::as_returning())
      .get_result(connection)
      .map_err(|error| {
        return if let Error::DatabaseError(DatabaseErrorKind::UniqueViolation, _) = error {
          CreateBusinessError::NonUniqueContact
        } else {
          CreateBusinessError::UnknownError(error)
        };
      })?;

    let created_payment = diesel::insert_into(payment::table)
      .values(&NewPaymentEntity {
        account_number: new_business.account_number.clone(),
        account_name: new_business.account_name.clone(),
      })
      .returning(CreatedPaymentEntity::as_returning())
      .get_result(connection)
      .map_err(|error| {
        return if let Error::DatabaseError(DatabaseErrorKind::UniqueViolation, _) = error {
          CreateBusinessError::NonUniquePayment
        } else {
          CreateBusinessError::UnknownError(error)
        };
      })?;

    let created_business = diesel::insert_into(business::table)
      .values(&NewBusinessEntity {
        name: new_business.name.clone(),
        description: new_business.description.clone(),
        contact_id: Some(created_contact.contact_id),
        location_id: Some(created_location.location_id),
        payment_id: Some(created_payment.payment_id),
      })
      .returning(CreatedBusinessEntity::as_returning())
      .get_result(connection)
      .map_err(CreateBusinessError::UnknownError)?;

    Ok(CreatedBusiness {
      business_id: created_business.business_id,
      name: created_business.name,
    })
  })
}
