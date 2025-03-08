use std::fmt;

use diesel::result::Error;
use serde::Serialize;

use crate::connection::establish_connection;
use crate::model::*;
use diesel::prelude::*;

// Create Client //

#[derive(Debug)]
pub enum CreateProductError {
  DuplicateNameError,
  ConnectionError(ConnectionError),
  UnknownError(Error),
}

impl fmt::Display for CreateProductError {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    write!(f, "{:?}", self)
  }
}

impl From<Error> for CreateProductError {
  fn from(error: Error) -> Self {
    CreateProductError::UnknownError(error)
  }
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct CreatedProduct {
  pub product_id: i32,
  pub name: String,
}

pub type CreateProduct = NewProductEntity;

pub fn create_product(new_product: CreateProduct) -> Result<CreatedProduct, CreateProductError> {
  use crate::schema::product;

  let connection = &mut establish_connection().map_err(CreateProductError::ConnectionError)?;

  let created_product = diesel::insert_into(product::table)
    .values(new_product)
    .returning(CreatedProductEntity::as_returning())
    .get_result(connection)
    .map_err(|error| match error {
      Error::DatabaseError(diesel::result::DatabaseErrorKind::UniqueViolation, _) => {
        CreateProductError::DuplicateNameError
      }
      _ => CreateProductError::UnknownError(error),
    })?;

  Ok(CreatedProduct {
    product_id: created_product.product_id,
    name: created_product.name,
  })
}
