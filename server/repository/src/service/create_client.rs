use crate::connection::establish_connection;
use crate::model::*;
use crate::utility::contact::CreateContact;
use diesel::prelude::*;
use diesel::result::{DatabaseErrorKind, Error};
use diesel::SelectableHelper;
use serde::{Deserialize, Serialize};
use std::fmt;

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
#[serde(rename_all = "camelCase")]
pub struct CreateClient {
  pub name: String,
  pub description: Option<String>,
  pub business_id: i32,
  pub contact: CreateContact,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct CreatedClient {
  pub client_id: i32,
  pub name: String,
}

pub fn create_client(new_client: CreateClient) -> Result<CreatedClient, CreateClientError> {
  use crate::schema::{client, contact};

  let connection = &mut establish_connection().map_err(CreateClientError::ConnectionError)?;

  let (address, suburb, city) = match new_client.contact.location {
    Some(location) => (Some(location.address), location.suburb, Some(location.city)),
    None => (None, None, None),
  };

  connection.transaction::<_, CreateClientError, _>(|connection| {
    let created_contact = diesel::insert_into(contact::table)
      .values(&CreateContactEntity {
        name: new_client.contact.name.clone(),
        email: new_client.contact.email.clone(),
        cell: new_client.contact.cell.clone(),
        address,
        suburb,
        city,
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

    let created_client = diesel::insert_into(client::table)
      .values(&CreateClientEntity {
        name: new_client.name.clone(),
        business_id: new_client.business_id,
        description: new_client.description.clone(),
        contact_id: created_contact.contact_id,
      })
      .returning(CreatedClientEntity::as_returning())
      .get_result(connection)
      .map_err(CreateClientError::UnknownError)?;

    Ok(CreatedClient {
      client_id: created_client.client_id,
      name: created_client.name,
    })
  })
}
