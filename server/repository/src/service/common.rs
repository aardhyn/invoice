use serde::Deserialize;

#[derive(Debug, Deserialize)]
pub struct CreateLocation {
  pub address: String,
  pub suburb: Option<String>,
  pub city: String,
}

#[derive(Debug, Deserialize)]
pub struct CreateContact {
  pub name: String,
  pub cell: String,
  pub email: String,
}

#[derive(Debug, Deserialize)]
pub struct CreateLocatedContact {
  pub name: String,
  pub location: CreateLocation,
  pub cell: String,
  pub email: String,
}
