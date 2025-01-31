use crate::connection::establish_connection;
use crate::model::*;
use diesel::prelude::*;

pub type ServiceListItem = ServiceEntityListItem;

pub type ServiceList = Vec<ServiceListItem>;

pub fn list_services(business_id: i32) -> Result<ServiceList, String> {
  use crate::schema::service;

  let connection = &mut establish_connection().expect("Error connecting to database");

  let services = service::table
    .filter(service::business_id.eq(business_id))
    .select(ServiceEntityListItem::as_select())
    .load(connection)
    .expect("Error loading services");

  let list = services.into_iter().collect();

  Ok(list)
}
