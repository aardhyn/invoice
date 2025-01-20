use super::temporal::get_tax_year;
use diesel::prelude::*;
use diesel::PgConnection;

fn invoice_count(
  connection: &mut PgConnection,
  business_id: i32,
) -> Result<i64, diesel::result::Error> {
  use crate::schema::invoice;

  invoice::table
    .filter(invoice::business_id.eq(business_id))
    .count()
    .get_result::<i64>(connection)
}

#[derive(Debug)]
pub enum InvoiceKeyError {
  CountBusinessError(diesel::result::Error),
}

pub fn invoice_key(
  connection: &mut PgConnection,
  business_id: i32,
) -> Result<String, InvoiceKeyError> {
  let invoice_count =
    invoice_count(connection, business_id).map_err(InvoiceKeyError::CountBusinessError)?;
  let tax_year = get_tax_year();
  let invoice_key = format!("INVC-{tax_year}{invoice_count:0>5}");
  Ok(invoice_key)
}
