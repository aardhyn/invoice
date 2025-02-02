use serde::Serialize;

use crate::model::LocationEntity;

#[derive(Serialize)]
pub struct ClientContact {
  pub contact_id: i32,
  pub name: String,
  pub email: String,
  pub cell: String,
  pub location: LocationEntity,
}

#[derive(Serialize)]
pub struct BusinessContact {
  pub contact_id: i32,
  pub name: String,
  pub email: String,
  pub cell: String,
}
