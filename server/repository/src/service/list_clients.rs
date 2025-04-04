use diesel::SelectableHelper;

use crate::connection::establish_connection;
use crate::model::*;
use diesel::prelude::*;

pub type ClientListItem = ClientEntityListItem;

pub type ClientList = Vec<ClientListItem>;

pub fn list_clients(business_id: i32) -> Result<ClientList, String> {
  use crate::schema::client;

  let connection = &mut establish_connection().expect("Error connecting to database");

  let clients = client::table
    .filter(client::business_id.eq(business_id))
    .select(ClientEntityListItem::as_select())
    .limit(24)
    .load(connection)
    .expect("Error loading businesses");

  let list = clients
    .into_iter()
    .map(|client| ClientListItem {
      client_id: client.client_id,
      name: client.name.clone(),
    })
    .collect();

  Ok(list)
}
