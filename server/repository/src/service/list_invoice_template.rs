use diesel::SelectableHelper;

use crate::connection::establish_connection;
use crate::model::*;
use diesel::prelude::*;

pub type InvoiceTemplateList = Vec<InvoiceEntity>;

pub fn list_invoice_template() -> Result<InvoiceTemplateList, String> {
  use crate::schema::{invoice, invoice_template};

  let connection = &mut establish_connection().expect("Error connecting to database");

  let templates = invoice_template::table
    .inner_join(invoice::table)
    .select(InvoiceEntity::as_select())
    .load(connection)
    .expect("Error loading invoice templates");

  let list = templates.into_iter().collect();

  Ok(list)
}
