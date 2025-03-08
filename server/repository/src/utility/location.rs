use serde::{Deserialize, Serialize};

use crate::model::LocationEntity;

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Location {
  pub address: String,
  pub suburb: Option<String>,
  pub city: String,
}

impl Location {
  /// produce Some Location from a set of database fields `LocationEntity` or None
  pub fn from_entity(location: LocationEntity) -> Option<Location> {
    Some(Location {
      address: location.address?,
      suburb: location.suburb,
      city: location.city?,
    })
  }
}
