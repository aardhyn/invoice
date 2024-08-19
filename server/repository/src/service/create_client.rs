use std::fmt;

use diesel::result::{DatabaseErrorKind, Error};
use diesel::SelectableHelper;
use serde::{Deserialize, Serialize};

use crate::connection::establish_connection;
use crate::model::*;
use diesel::prelude::*;

use super::common::CreateContact;

// Create Client //

#[derive(Debug)]
pub enum CreateClientError {
  NonUniqueContact,
  ConnectionError(ConnectionError),
  UnknownError(Error),
}

impl fmt::Display for CreateClientError {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    write!(f, "{:?}", self)
  }
}

impl From<Error> for CreateClientError {
  fn from(error: Error) -> Self {
    CreateClientError::UnknownError(error)
  }
}

#[derive(Debug, Deserialize)]
pub struct CreateClient {
  pub name: String,
  pub description: Option<String>,
  pub contact: CreateContact,
}

#[derive(Debug, Deserialize)]
pub struct FilterClient {}

#[derive(Debug, Serialize)]
pub struct CreatedClient {
  pub client_id: i32,
  pub name: String,
}

pub fn create_client(new_client: CreateClient) -> Result<CreatedClient, CreateClientError> {
  use crate::schema::{client, contact, location};

  let connection = &mut establish_connection().map_err(CreateClientError::ConnectionError)?;

  connection.transaction::<_, CreateClientError, _>(|connection| {
    let created_contact_location = diesel::insert_into(location::table)
      .values(&NewLocationEntity {
        address: new_client.contact.location.address.clone(),
        suburb: new_client.contact.location.suburb.clone(),
        city: new_client.contact.location.city.clone(),
      })
      .returning(CreatedLocationEntity::as_returning())
      .get_result(connection)?;

    let created_contact = diesel::insert_into(contact::table)
      .values(&NewContactEntity {
        location_id: created_contact_location.location_id,
        name: new_client.contact.name.clone(),
        email: new_client.contact.email.clone(),
        cell: new_client.contact.cell.clone(),
      })
      .returning(CreatedContactEntity::as_returning())
      .get_result(connection)
      .map_err(|error| {
        return if let Error::DatabaseError(DatabaseErrorKind::UniqueViolation, _) = error {
          CreateClientError::NonUniqueContact
        } else {
          CreateClientError::UnknownError(error)
        };
      })?;

    let created_business = diesel::insert_into(client::table)
      .values(&NewClientEntity {
        name: new_client.name.clone(),
        description: new_client.description.clone(),
        contact_id: created_contact.contact_id,
      })
      .returning(CreatedClientEntity::as_returning())
      .get_result(connection)
      .map_err(CreateClientError::UnknownError)?;

    Ok(CreatedClient {
      client_id: created_business.client_id,
      name: created_business.name,
    })
  })
}
