use diesel::SelectableHelper;

use crate::connection::establish_connection;
use crate::model::*;
use diesel::prelude::*;

pub type InvoiceList = Vec<InvoiceEntityListItem>;

pub fn list_invoices(business_id: i32) -> Result<InvoiceList, String> {
  use crate::schema::invoice;

  let connection = &mut establish_connection().expect("Error connecting to database");

  let invoices = invoice::table
    .filter(invoice::business_id.eq(business_id))
    .select(InvoiceEntityListItem::as_select())
    .limit(24)
    .load(connection)
    .expect("Error loading businesses");

  let list = invoices.into_iter().collect();

  Ok(list)
}
