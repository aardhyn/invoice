use diesel::SelectableHelper;

use crate::connection::establish_connection;
use crate::model::*;
use diesel::prelude::*;

pub type InvoiceList = Vec<InvoiceEntityListItem>;

pub fn list_invoices() -> Result<InvoiceList, String> {
  use crate::schema::invoice;

  let connection = &mut establish_connection().expect("Error connecting to database");

  let invoices = invoice::table
    .select(InvoiceEntityListItem::as_select())
    .limit(24)
    .load(connection)
    .expect("Error loading businesses");

  let list = invoices.into_iter().collect();

  Ok(list)
}
