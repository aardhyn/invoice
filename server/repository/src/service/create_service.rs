use std::fmt;

use diesel::result::Error;
use serde::Serialize;

use crate::connection::establish_connection;
use crate::model::*;
use diesel::prelude::*;

// Create Client //

#[derive(Debug)]
pub enum CreateServiceError {
  DuplicateNameError,
  ConnectionError(ConnectionError),
  UnknownError(Error),
}

impl fmt::Display for CreateServiceError {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    write!(f, "{:?}", self)
  }
}

impl From<Error> for CreateServiceError {
  fn from(error: Error) -> Self {
    CreateServiceError::UnknownError(error)
  }
}

#[derive(Debug, Serialize)]
pub struct CreatedService {
  pub service_id: i32,
  pub name: String,
}

pub type CreateService = NewServiceEntity;

pub fn create_service(new_service: CreateService) -> Result<CreatedService, CreateServiceError> {
  use crate::schema::service;

  let connection = &mut establish_connection().map_err(CreateServiceError::ConnectionError)?;

  connection.transaction::<_, CreateServiceError, _>(|connection| {
    let created_service = diesel::insert_into(service::table)
      .values(new_service)
      .returning(CreatedServiceEntity::as_returning())
      .get_result(connection)
      .map_err(|error| match error {
        Error::DatabaseError(diesel::result::DatabaseErrorKind::UniqueViolation, _) => {
          CreateServiceError::DuplicateNameError
        }
        _ => CreateServiceError::UnknownError(error),
      })?;

    Ok(CreatedService {
      service_id: created_service.service_id,
      name: created_service.name,
    })
  })
}
