use std::cmp::max;

use crate::utility::string::extract_trailing_integer;
use diesel::prelude::*;
use diesel::PgConnection;

use super::temporal::get_tax_year;

pub fn invoice_count(
  connection: &mut PgConnection,
  business_id: i32,
) -> Result<i64, diesel::result::Error> {
  use crate::schema::invoice;

  invoice::table
    .filter(invoice::business_id.eq(business_id))
    .count()
    .get_result::<i64>(connection)
}

pub const DEFAULT_UNTITLED_INVOICE_NAME: &str = "Untitled";

fn create_untitled_invoice_name(invoice_count: i32) -> String {
  format!("{} {}", DEFAULT_UNTITLED_INVOICE_NAME, invoice_count)
}

pub fn next_untitled_invoice_name(
  connection: &mut PgConnection,
  business_id: i32,
) -> Result<String, diesel::result::Error> {
  use crate::schema::invoice;

  let untitled_invoice_names = invoice::table
    .filter(invoice::business_id.eq(business_id))
    .filter(invoice::name.similar_to(format!("{}%", DEFAULT_UNTITLED_INVOICE_NAME)))
    .select(invoice::name)
    .load::<String>(connection)?;

  let last_untitled_invoice_number = untitled_invoice_names
    .iter()
    .fold(0, |count, next| max(count, extract_trailing_integer(next)));

  let next_name = create_untitled_invoice_name(last_untitled_invoice_number + 1);

  Ok(next_name)
}

pub fn invoice_key(
  connection: &mut PgConnection,
  business_id: i32,
) -> Result<String, diesel::result::Error> {
  let invoice_count = invoice_count(connection, business_id)?;
  let tax_year = get_tax_year();
  let invoice_key = format!("INVC-{tax_year}{invoice_count:0>5}");
  Ok(invoice_key)
}
