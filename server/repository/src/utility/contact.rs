use super::location::Location;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Contact {
  pub contact_id: i32,
  pub name: String,
  pub cell: String,
  pub email: String,
  pub location: Option<Location>,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CreateContact {
  pub name: String,
  pub cell: String,
  pub email: String,
  pub location: Option<Location>,
}
