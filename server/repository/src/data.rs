use std::vec;

use chrono::Utc;
use uuid::Uuid;

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
    NewLocationEntity {
      address: String::from("1011 Business St"),
      suburb: Some(String::from("Suburb")),
      city: String::from("City"),
    },
    NewLocationEntity {
      address: String::from("1213 Payment St"),
      suburb: Some(String::from("Suburb")),
      city: String::from("City"),
    },
    NewLocationEntity {
      address: String::from("1415 Invoice St"),
      suburb: Some(String::from("Suburb")),
      city: String::from("City"),
    },
    NewLocationEntity {
      address: String::from("1617 Line Item St"),
      suburb: Some(String::from("Suburb")),
      city: String::from("City"),
    },
    NewLocationEntity {
      address: String::from("1819 Product St"),
      suburb: Some(String::from("Suburb")),
      city: String::from("City"),
    },
    NewLocationEntity {
      address: String::from("2021 Service St"),
      suburb: Some(String::from("Suburb")),
      city: String::from("City"),
    },
  ]
}

pub fn seed_contact() -> Vec<NewContactEntity> {
  vec![
    NewContactEntity {
      location_id: None,
      name: String::from("John Carmack"),
      email: String::from("jcarmack@id.co.us"),
      cell: String::from("0211234567"),
    },
    NewContactEntity {
      location_id: None,
      name: String::from("Chris Sawyer"),
      email: String::from("csawyer@rct.co.uk"),
      cell: String::from("0217654321"),
    },
    NewContactEntity {
      location_id: None,
      name: String::from("Tom Happ"),
      email: String::from("thapp@thg.com"),
      cell: String::from("0219876543"),
    },
    NewContactEntity {
      location_id: Some(1),
      name: String::from("John Romero"),
      email: String::from("jromero@id.co.us"),
      cell: String::from("0211234567"),
    },
    NewContactEntity {
      location_id: Some(2),
      name: String::from("Andreas Kling"),
      email: String::from("courage@ladybird.com"),
      cell: String::from("0217654321"),
    },
    NewContactEntity {
      location_id: Some(3),
      name: String::from("Tarn Adams"),
      email: String::from("tadams@df.net"),
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
    NewPaymentEntity {
      account_number: String::from("1357924680"),
      account_name: String::from("Tertiary Account"),
    },
  ]
}

pub fn seed_business() -> Vec<NewBusinessEntity> {
  vec![
    NewBusinessEntity {
      name: String::from("Weyland Yutani"),
      description: Some(String::from("Building Better Worlds")),
      location_id: Some(4),
      contact_id: Some(1),
      payment_id: Some(1),
    },
    NewBusinessEntity {
      name: String::from("Tyrell Corp"),
      description: Some(String::from("More Human Than Human")),
      location_id: Some(5),
      contact_id: Some(2),
      payment_id: Some(1),
    },
    NewBusinessEntity {
      name: String::from("Aperture Science"),
      description: Some(String::from("We Do What We Must Because We Can")),
      location_id: Some(6),
      contact_id: Some(3),
      payment_id: Some(2),
    },
  ]
}

pub fn seed_client() -> Vec<NewClientEntity> {
  vec![
    NewClientEntity {
      name: String::from("Wayne Enterprises"),
      description: Some(String::from("I Am Vengeance, I Am The Night, I Am Batman")),
      contact_id: 4,
    },
    NewClientEntity {
      name: String::from("Stark Industries"),
      description: Some(String::from("We Have A Hulk")),
      contact_id: 5,
    },
    NewClientEntity {
      name: String::from("Winter Cooperation"),
      description: Some(String::from("Time Entwined")),
      contact_id: 6,
    },
  ]
}

pub fn seed_product() -> Vec<NewProductEntity> {
  vec![
    NewProductEntity {
      name: String::from("Product 1"),
      description: Some(String::from("First Product")),
      price: 1000,
    },
    NewProductEntity {
      name: String::from("Product 2"),
      description: Some(String::from("Second Product")),
      price: 2400,
    },
    NewProductEntity {
      name: String::from("Product 3"),
      description: Some(String::from("Third Product")),
      price: 3600,
    },
  ]
}

pub fn seed_service() -> Vec<NewServiceEntity> {
  vec![
    NewServiceEntity {
      name: String::from("Service 1"),
      description: Some(String::from("First Service")),
      initial_rate: Some(1200),
      initial_rate_threshold: Some(1),
      rate: 1000,
    },
    NewServiceEntity {
      name: String::from("Service 2"),
      description: Some(String::from("Second Service")),
      initial_rate: Some(4400),
      initial_rate_threshold: Some(1),
      rate: 4100,
    },
    NewServiceEntity {
      name: String::from("Service 3"),
      description: Some(String::from("Third Service")),
      initial_rate: None,
      initial_rate_threshold: None,
      rate: 2300,
    },
  ]
}

pub fn seed_invoice() -> Vec<NewInvoiceEntity> {
  vec![
    NewInvoiceEntity {
      invoice_key: String::from("INVC-2500001"),
      name: String::from("Invoice 1"),
      description: Some(String::from("First Invoice")),
      reference: Some(String::from("John")),
      client_id: 1,
      business_id: 1,
      location_id: 7,
      client_data: serde_json::json!("{}"),
      payment_data: serde_json::json!("{}"),
      location_data: serde_json::json!("{}"),
      due_date: Utc::now(),
      line_items: serde_json::json!([{
        "key": Uuid::new_v4(),
        "name": "Line Item 1",
        "description": "First Line Item",
        "quantity": 1,
        "custom_fields": [{
          "key": Uuid::new_v4(),
          "name": "waived",
          "data": false,
        }],
      }, {
        "key": Uuid::new_v4(),
        "name": "Product Item 2",
        "description": "Second Line Item",
        "detail": { "product_id": 1, },
        "quantity": 2,
        "custom_fields": [],
      }, {
        "key": Uuid::new_v4(),
        "name": "Service Item 3",
        "description": "Third Line Item",
        "detail": { "service_id": 1, },
        "quantity": 2,
        "custom_fields": [],
      } ]),
    },
    NewInvoiceEntity {
      invoice_key: String::from("INVC-2500002"),
      name: String::from("Invoice 2"),
      description: Some(String::from("Second Invoice")),
      reference: Some(String::from("Andreas")),
      client_id: 2,
      business_id: 2,
      location_id: 8,
      client_data: serde_json::json!("{}"),
      payment_data: serde_json::json!("{}"),
      location_data: serde_json::json!("{}"),
      due_date: Utc::now(),
      line_items: serde_json::json!([{
        "key": Uuid::new_v4(),
        "name": "Line Item 1",
        "description": "Service Line Item",
        "detail": { "service_id": 2, },
        "quantity": 2,
        "custom_fields": [],
      }, {
        "key": Uuid::new_v4(),
        "name": "Service Item 2",
        "detail": { "service_id": 3, },
        "description": "Second Service Line Item",
        "quantity": 5,
        "custom_fields": [],
      }, {
        "key": Uuid::new_v4(),
        "name": "Product Item 3",
        "description": "Third Service Line Item",
        "detail": { "product_id": 2, },
        "quantity": 3,
        "custom_fields": [{
          "key": Uuid::new_v4(),
          "name": "waived",
          "data": false,
        }],
      }]),
    },
    NewInvoiceEntity {
      invoice_key: String::from("INVC-2500003"),
      name: String::from("Invoice 3"),
      description: Some(String::from("Third Invoice")),
      reference: Some(String::from("Tarn")),
      client_id: 3,
      business_id: 3,
      location_id: 9,
      client_data: serde_json::json!("{}"),
      payment_data: serde_json::json!("{}"),
      location_data: serde_json::json!("{}"),
      due_date: Utc::now(),
      line_items: serde_json::json!([{
        "key": Uuid::new_v4(),
        "name": "Custom Item 1",
        "description": "Custom Line Item",
        "detail": { "product_id": 3, },
        "quantity": 1,
        "custom_fields": [{
          "key": Uuid::new_v4(),
          "name": "waived",
          "data": false,
        }, {
          "key": Uuid::new_v4(),
          "name": "discount",
          "data": 0.3,
        }],
      }, {
        "key": Uuid::new_v4(),
        "name": "Service Item 2",
        "description": "Second Custom Line Item",
        "quantity": 3,
        "custom_fields": [{
          "key": Uuid::new_v4(),
          "name": "waived",
          "data": false,
        }],
      }, {
        "key": Uuid::new_v4(),
        "name": "Custom Item 3",
        "description": "Third Custom Line Item",
        "quantity": 1,
        "custom_fields": [],
      }]),
    },
  ]
}
