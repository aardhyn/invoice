use crate::connection::establish_connection;
use crate::model::*;
use diesel::prelude::*;

pub type ProductListItem = ProductEntityListItem;

pub type ProductList = Vec<ProductListItem>;

pub fn list_products() -> Result<ProductList, String> {
  use crate::schema::product;

  let connection = &mut establish_connection().expect("Error connecting to database");

  let services = product::table
    .select(ProductEntityListItem::as_select())
    .load(connection)
    .expect("Error loading businesses");

  let list = services.into_iter().collect();

  Ok(list)
}
