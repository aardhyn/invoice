use crate::connection::establish_connection;
use crate::model::*;
use crate::utility::location::Location;
use diesel::prelude::*;
use serde::Serialize;

#[derive(Serialize)]
pub struct InvoiceTemplateListItem {
  pub invoice_id: i32,
  pub name: String,
  pub description: Option<String>,
  pub location: Location,
  pub client: String,
}

pub type InvoiceTemplateList = Vec<InvoiceTemplateListItem>;

pub fn list_invoice_template(business_id: i32) -> Result<InvoiceTemplateList, String> {
  use crate::schema::{client, invoice, invoice_template};

  let connection = &mut establish_connection().expect("Error connecting to database");

  let templates = invoice::table
    .inner_join(invoice_template::table)
    .inner_join(client::table)
    .filter(invoice::business_id.eq(business_id))
    .select((
      invoice::invoice_id,
      invoice::name,
      invoice::description,
      invoice::address,
      invoice::suburb,
      invoice::city,
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
      location: Location {
        address: template.address.clone().unwrap(), // fixme: no unwrap
        suburb: template.suburb.clone(),
        city: template.city.clone().unwrap(), // ditto
      },
      client: template.client_name.clone(),
    })
    .collect();

  Ok(list)
}
