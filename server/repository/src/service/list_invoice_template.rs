use crate::connection::establish_connection;
use crate::model::*;
use crate::utility::location::Location;
use diesel::prelude::*;
use serde::Serialize;

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct InvoiceTemplateListItem {
  pub invoice_id: i32,
  pub name: String,
  pub description: Option<String>,
  pub location: Option<Location>,
  pub client: Option<String>,
}

pub type InvoiceTemplateList = Vec<InvoiceTemplateListItem>;

pub fn list_invoice_template(business_id: i32) -> Result<InvoiceTemplateList, String> {
  use crate::schema::{client, invoice, invoice_template};

  let connection = &mut establish_connection().expect("Error connecting to database");

  let templates = invoice::table
    .inner_join(invoice_template::table)
    .left_join(client::table)
    .filter(invoice::business_id.eq(business_id))
    .select((
      invoice::invoice_id,
      invoice::name,
      invoice::description,
      invoice::address,
      invoice::suburb,
      invoice::city,
      client::name.nullable(),
    ))
    .load::<InvoiceTemplateListEntity>(connection)
    .expect("Error loading invoice templates");

  let list = templates
    .into_iter()
    .map(|template| {
      let location = Location::from_entity(LocationEntity {
        address: template.address,
        suburb: template.suburb,
        city: template.city,
      });

      InvoiceTemplateListItem {
        invoice_id: template.invoice_id,
        name: template.name.clone(),
        description: template.description.clone(),
        client: template.client_name.clone(),
        location,
      }
    })
    .collect();

  Ok(list)
}
