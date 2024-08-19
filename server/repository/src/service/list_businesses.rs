use diesel::SelectableHelper;

use crate::connection::establish_connection;
use crate::model::*;
use diesel::prelude::*;

pub type BusinessListItem = BusinessEntityListItem;

pub type BusinessList = Vec<BusinessListItem>;

pub fn list_businesses() -> Result<BusinessList, String> {
  use crate::schema::business;

  let connection = &mut establish_connection().expect("Error connecting to database");

  let businesses = business::table
    .select(BusinessEntityListItem::as_select())
    .limit(24)
    .load(connection)
    .expect("Error loading businesses");

  let list = businesses
    .into_iter()
    .map(|business| BusinessListItem {
      business_id: business.business_id,
      name: business.name.clone(),
    })
    .collect();

  Ok(list)
}
