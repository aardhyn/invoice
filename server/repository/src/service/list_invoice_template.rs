use crate::connection::establish_connection;
use crate::model::*;
use diesel::prelude::*;
use serde::Serialize;

#[derive(Serialize)]
pub struct InvoiceTemplateLocation {
  pub address: String,
  pub suburb: Option<String>,
  pub city: String,
}

#[derive(Serialize)]
pub struct InvoiceTemplateListItem {
  pub invoice_id: i32,
  pub name: String,
  pub description: Option<String>,
  pub location: InvoiceTemplateLocation,
  pub client: String,
}

pub type InvoiceTemplateList = Vec<InvoiceTemplateListItem>;

pub fn list_invoice_template() -> Result<InvoiceTemplateList, String> {
  use crate::schema::{client, invoice, invoice_template, location};

  let connection = &mut establish_connection().expect("Error connecting to database");

  let templates = invoice::table
    .inner_join(invoice_template::table)
    .inner_join(location::table)
    .inner_join(client::table)
    .select((
      invoice::invoice_id,
      invoice::name,
      invoice::description,
      location::address,
      location::suburb,
      location::city,
      client::name,
    ))
    .load::<InvoiceTemplateListEntity>(connection)
    .expect("Error loading invoice templates");

  let list = templates
    .into_iter()
    .map(|template| InvoiceTemplateListItem {
      invoice_id: template.invoice_id,
      name: template.name.clone(),
      description: template.description.clone(),
      location: InvoiceTemplateLocation {
        address: template.address.clone(),
        suburb: template.suburb.clone(),
        city: template.city.clone(),
      },
      client: template.client_name.clone(),
    })
    .collect();

  Ok(list)
}
