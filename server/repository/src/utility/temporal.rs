use chrono::{Datelike, Utc};

const TAX_YEAR_FIRST_MONTH: u32 = 1;

pub fn get_tax_year() -> u32 {
  let tax_year = Utc::now().year() as u32;
  if (Utc::now().month() as u32) < TAX_YEAR_FIRST_MONTH {
    tax_year - 1
  } else {
    tax_year
  }
}
