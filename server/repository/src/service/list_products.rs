use crate::connection::establish_connection;
use crate::model::*;
use diesel::prelude::*;

pub type ProductListItem = ProductEntityListItem;

pub type ProductList = Vec<ProductListItem>;

pub fn list_products(business_id: i32) -> Result<ProductList, String> {
  use crate::schema::product;

  let connection = &mut establish_connection().expect("Error connecting to database");

  let products = product::table
    .filter(product::business_id.eq(business_id))
    .select(ProductEntityListItem::as_select())
    .load(connection)
    .expect("Error loading businesses");

  let list = products.into_iter().collect();

  Ok(list)
}
