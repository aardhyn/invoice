use chrono::{DateTime, TimeZone, Utc};

use crate::model::*;

pub fn seed_location() -> Vec<NewLocationEntity> {
  vec![
    NewLocationEntity {
      address: String::from("123 Main St"),
      suburb: Some(String::from("Suburb")),
      city: String::from("City"),
    },
    NewLocationEntity {
      address: String::from("456 Secondary St"),
      suburb: Some(String::from("Suburb")),
      city: String::from("City"),
    },
    NewLocationEntity {
      address: String::from("789 Clients St"),
      suburb: None,
      city: String::from("City"),
    },
  ]
}

pub fn seed_contact() -> Vec<NewContactEntity> {
  vec![
    NewContactEntity {
      location_id: 1,
      name: String::from("John Carmack"),
      email: String::from("jcarmack@id.co.nz"),
      cell: String::from("0211234567"),
    },
    NewContactEntity {
      location_id: 2,
      name: String::from("Chris Sawyer"),
      email: String::from("csawyer@rct.co.uk"),
      cell: String::from("0217654321"),
    },
    NewContactEntity {
      location_id: 3,
      name: String::from("Tom Happ"),
      email: String::from("thapp@thg.com"),
      cell: String::from("0219876543"),
    },
  ]
}

pub fn seed_payment() -> Vec<NewPaymentEntity> {
  vec![
    NewPaymentEntity {
      account_number: String::from("1234567890"),
      account_name: String::from("Main Account"),
    },
    NewPaymentEntity {
      account_number: String::from("0987654321"),
      account_name: String::from("Secondary Account"),
    },
  ]
}

pub fn seed_business() -> Vec<NewBusinessEntity> {
  vec![
    NewBusinessEntity {
      name: String::from("Weyland Yutani"),
      description: Some(String::from("Building Better Worlds")),
      location_id: Some(1),
      contact_id: Some(1),
      payment_id: Some(1),
    },
    NewBusinessEntity {
      name: String::from("Tyrell Corp"),
      description: Some(String::from("More Human Than Human")),
      payment_id: Some(1),
      location_id: Some(2),
      contact_id: Some(2),
    },
    NewBusinessEntity {
      name: String::from("Aperture Science"),
      description: Some(String::from("We Do What We Must Because We Can")),
      location_id: Some(1),
      contact_id: Some(1),
      payment_id: Some(2),
    },
  ]
}

pub fn seed_client() -> Vec<NewClientEntity> {
  vec![
    NewClientEntity {
      name: String::from("Wayne Enterprises"),
      description: Some(String::from("I Am Vengeance, I Am The Night, I Am Batman")),
      contact_id: 1,
    },
    NewClientEntity {
      name: String::from("Stark Industries"),
      description: Some(String::from("We Have A Hulk")),
      contact_id: 2,
    },
    NewClientEntity {
      name: String::from("Winter Cooperation"),
      description: Some(String::from("Time Entwined")),
      contact_id: 3,
    },
  ]
}

pub fn seed_invoice() -> Vec<NewInvoiceEntity> {
  vec![
    NewInvoiceEntity {
      name: String::from("Invoice 1"),
      description: Some(String::from("First Invoice")),
      client_id: 1,
      business_id: 1,
      location_id: 1,
      client_data: serde_json::json!("{}"),
      payment_data: serde_json::json!("{}"),
      location_data: serde_json::json!("{}"),
      due_date: Utc::now(),
      line_items: serde_json::json!([{
        "name": "Line Item 1",
        "description": "First Line Item",
        "quantity": 1,
        "unit_price": 100.0,
      }]),
    },
    NewInvoiceEntity {
      name: String::from("Invoice 2"),
      description: Some(String::from("Second Invoice")),
      client_id: 2,
      business_id: 2,
      location_id: 2,
      client_data: serde_json::json!("{}"),
      payment_data: serde_json::json!("{}"),
      location_data: serde_json::json!("{}"),
      due_date: Utc::now(),
      line_items: serde_json::json!([{
        "name": "Line Item 2",
        "description": "Second Line Item",
        "quantity": 2,
        "unit_price": 200.0,
      }]),
    },
    NewInvoiceEntity {
      name: String::from("Invoice 3"),
      description: Some(String::from("Third Invoice")),
      client_id: 3,
      business_id: 3,
      location_id: 3,
      client_data: serde_json::json!("{}"),
      payment_data: serde_json::json!("{}"),
      location_data: serde_json::json!("{}"),
      due_date: Utc::now(),
      line_items: serde_json::json!([{
        "name": "Line Item 3",
        "description": "Third Line Item",
        "quantity": 3,
        "unit_price": 300.0,
      }]),
    },
  ]
}
