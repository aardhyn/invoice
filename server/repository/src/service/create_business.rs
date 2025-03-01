use crate::connection::establish_connection;
use crate::model::*;
use crate::utility::contact::Contact;
use crate::utility::location::Location;
use diesel::prelude::*;
use diesel::result::{DatabaseErrorKind, Error};
use diesel::SelectableHelper;
use serde::{Deserialize, Serialize};
use std::fmt;

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
  pub contact: Contact,
  pub location: Option<Location>,
  pub account_number: String,
  pub account_name: String,
}

#[derive(Debug, Serialize)]
pub struct CreatedBusiness {
  pub business_id: i32,
  pub name: String,
}

pub fn create_business(
  new_business: CreateBusiness,
) -> Result<CreatedBusiness, CreateBusinessError> {
  use crate::schema::{business, contact, payment};

  let connection = &mut establish_connection().map_err(CreateBusinessError::ConnectionError)?;

  let (address, suburb, city) = match new_business.contact.location {
    Some(location) => (Some(location.address), location.suburb, Some(location.city)),
    None => (None, None, None),
  };

  connection.transaction::<_, CreateBusinessError, _>(|connection| {
    let created_contact = diesel::insert_into(contact::table)
      .values(&CreateContactEntity {
        name: new_business.contact.name.clone(),
        email: new_business.contact.email.clone(),
        cell: new_business.contact.cell.clone(),
        address,
        suburb,
        city,
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

    // fixme: shadowing variables from `new_business.contact.location`
    let (address, suburb, city) = match new_business.location {
      Some(location) => (Some(location.address), location.suburb, Some(location.city)),
      None => (None, None, None),
    };

    let created_business = diesel::insert_into(business::table)
      .values(&NewBusinessEntity {
        name: new_business.name.clone(),
        description: new_business.description.clone(),
        contact_id: Some(created_contact.contact_id),
        payment_id: Some(created_payment.payment_id),
        address,
        suburb,
        city,
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
