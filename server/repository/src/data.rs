use crate::model::*;
use std::vec;
use uuid::Uuid;

pub fn seed_contact() -> Vec<CreateContactEntity> {
  vec![
    CreateContactEntity {
      name: String::from("John Carmack"),
      email: String::from("jcarmack@id.co.us"),
      cell: String::from("0211234567"),
      address: None,
      suburb: None,
      city: None,
    },
    CreateContactEntity {
      name: String::from("Chris Sawyer"),
      email: String::from("csawyer@rct.co.uk"),
      cell: String::from("0217654321"),
      address: None,
      suburb: None,
      city: None,
    },
    CreateContactEntity {
      name: String::from("Tom Happ"),
      email: String::from("thapp@thg.com"),
      cell: String::from("0219876543"),
      address: None,
      suburb: None,
      city: None,
    },
    CreateContactEntity {
      name: String::from("John Romero"),
      email: String::from("jromero@id.co.us"),
      cell: String::from("0211234567"),
      address: Some(String::from("123 Main St")),
      suburb: Some(String::from("Suburb")),
      city: Some(String::from("City")),
    },
    CreateContactEntity {
      name: String::from("Andreas Kling"),
      email: String::from("courage@ladybird.com"),
      cell: String::from("0217654321"),
      address: Some(String::from("456 Secondary St")),
      suburb: Some(String::from("Suburb")),
      city: Some(String::from("City")),
    },
    CreateContactEntity {
      name: String::from("Tarn Adams"),
      email: String::from("tadams@df.net"),
      cell: String::from("0219876543"),
      address: Some(String::from("1011 Business St")),
      suburb: Some(String::from("Suburb")),
      city: Some(String::from("City")),
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
      name: String::from("Aperture Science Inc"),
      description: Some(String::from("We Do What We Must Because We Can")),
      contact_id: Some(1),
      payment_id: Some(1),
      address: Some(String::from("1617 Line Item St")),
      suburb: Some(String::from("Suburb")),
      city: Some(String::from("City")),
    },
    // NewBusinessEntity {
    //   name: String::from("Weyland Yutani"),
    //   description: Some(String::from("Building Better Worlds")),
    //   contact_id: Some(2),
    //   payment_id: Some(2),
    //   address: Some(String::from("1213 Payment St")),
    //   suburb: Some(String::from("Suburb")),
    //   city: Some(String::from("City")),
    // },
    // NewBusinessEntity {
    //   name: String::from("Tyrell Corp"),
    //   description: Some(String::from("More Human Than Human")),
    //   contact_id: Some(3),
    //   payment_id: Some(3),
    //   address: Some(String::from("1415 Invoice St")),
    //   suburb: Some(String::from("Suburb")),
    //   city: Some(String::from("City")),
    // },
  ]
}

pub fn seed_client() -> Vec<CreateClientEntity> {
  vec![
    CreateClientEntity {
      name: String::from("Wayne Enterprises"),
      business_id: 1,
      description: Some(String::from("I Am Vengeance, I Am The Night, I Am Batman")),
      contact_id: 4,
    },
    CreateClientEntity {
      name: String::from("Stark Industries"),
      description: Some(String::from("We Have A Hulk")),
      business_id: 1,
      contact_id: 5,
    },
    CreateClientEntity {
      name: String::from("Winter Cooperation"),
      description: Some(String::from("Time Entwined")),
      business_id: 1,
      contact_id: 6,
    },
  ]
}

pub fn seed_product() -> Vec<NewProductEntity> {
  vec![
    NewProductEntity {
      name: String::from("Product 1"),
      description: Some(String::from("First Product")),
      business_id: 1,
      unit_cost: 1000,
    },
    NewProductEntity {
      name: String::from("Product 2"),
      description: Some(String::from("Second Product")),
      business_id: 1,
      unit_cost: 2400,
    },
    NewProductEntity {
      name: String::from("Product 3"),
      description: Some(String::from("Third Product")),
      business_id: 1,
      unit_cost: 3600,
    },
  ]
}

pub fn seed_service() -> Vec<NewServiceEntity> {
  vec![
    NewServiceEntity {
      name: String::from("Service 1"),
      description: Some(String::from("First Service")),
      business_id: 1,
      initial_rate: Some(1200),
      initial_rate_threshold: Some(1),
      rate: 1000,
    },
    NewServiceEntity {
      name: String::from("Service 2"),
      description: Some(String::from("Second Service")),
      business_id: 1,
      initial_rate: Some(4400),
      initial_rate_threshold: Some(1),
      rate: 4100,
    },
    NewServiceEntity {
      name: String::from("Service 3"),
      description: Some(String::from("Third Service")),
      business_id: 1,
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
      business_id: 1,
      // description: Some(String::from("First Invoice")),
      // reference: Some(String::from("John")),
      // client_id: 1,
      // address: Some(String::from("123 Main St")),
      // suburb: Some(String::from("Suburb")),
      // city: Some(String::from("City")),
      // due_date: Utc::now(),
    },
    NewInvoiceEntity {
      invoice_key: String::from("INVC-2500002"),
      name: String::from("Invoice 2"),
      business_id: 1,
      // description: Some(String::from("Second Invoice")),
      // reference: Some(String::from("Andreas")),
      // client_id: 2,
      // address: Some(String::from("456 Secondary St")),
      // suburb: Some(String::from("Suburb")),
      // city: Some(String::from("City")),
      // due_date: Utc::now(),
    },
    NewInvoiceEntity {
      invoice_key: String::from("INVC-2500003"),
      name: String::from("Invoice 3"),
      business_id: 1,
      //   description: Some(String::from("Third Invoice")),
      //   reference: Some(String::from("Tarn")),
      //   client_id: 3,
      //   address: Some(String::from("1011 Business St")),
      //   suburb: Some(String::from("Suburb")),
      //   city: Some(String::from("City")),
      //   due_date: Utc::now(),
    },
  ]
}

pub fn seed_line_items() -> Vec<Vec<LineItemEntity>> {
  vec![
    vec![
      LineItemEntity {
        key: Uuid::new_v4(),
        name: String::from("Line Item 1"),
        description: String::from("First Line Item"),
        quantity: 1,
        detail: Some(LineItemDetail::Service(ServiceLineItemEntity {
          service_id: 1,
        })),
        custom_fields: vec![LineItemCustomField {
          key: Uuid::new_v4(),
          name: String::from("waived"),
          data: LineItemCustomFieldType::Boolean(false),
        }],
      },
      LineItemEntity {
        key: Uuid::new_v4(),
        name: String::from("Product Item 2"),
        description: String::from("Second Line Item"),
        quantity: 2,
        detail: Some(LineItemDetail::Product(ProductLineItemEntity {
          product_id: 1,
        })),
        custom_fields: vec![],
      },
      LineItemEntity {
        key: Uuid::new_v4(),
        name: String::from("Service Item 3"),
        description: String::from("Third Line Item"),
        quantity: 2,
        detail: Some(LineItemDetail::Service(ServiceLineItemEntity {
          service_id: 1,
        })),
        custom_fields: vec![],
      },
    ],
    vec![
      LineItemEntity {
        key: Uuid::new_v4(),
        name: String::from("Line Item 1"),
        description: String::from("Service Line Item"),
        quantity: 2,
        detail: Some(LineItemDetail::Service(ServiceLineItemEntity {
          service_id: 2,
        })),
        custom_fields: vec![],
      },
      LineItemEntity {
        key: Uuid::new_v4(),
        name: String::from("Generic Custom Line Item"),
        description: String::from("Second Service Line Item"),
        quantity: 5,
        detail: Some(LineItemDetail::Service(ServiceLineItemEntity {
          service_id: 2,
        })),
        custom_fields: vec![],
      },
      LineItemEntity {
        key: Uuid::new_v4(),
        name: String::from("Product Item 3"),
        description: String::from("Third Service Line Item"),
        quantity: 3,
        detail: Some(LineItemDetail::Product(ProductLineItemEntity {
          product_id: 2,
        })),
        custom_fields: vec![LineItemCustomField {
          key: Uuid::new_v4(),
          name: String::from("waived"),
          data: LineItemCustomFieldType::Boolean(false),
        }],
      },
    ],
    vec![
      LineItemEntity {
        key: Uuid::new_v4(),
        name: String::from("Custom Item 1"),
        description: String::from("Custom Line Item"),
        quantity: 1,
        detail: Some(LineItemDetail::Product(ProductLineItemEntity {
          product_id: 3,
        })),
        custom_fields: vec![
          LineItemCustomField {
            key: Uuid::new_v4(),
            name: String::from("waived"),
            data: LineItemCustomFieldType::Boolean(false),
          },
          LineItemCustomField {
            key: Uuid::new_v4(),
            name: String::from("discount"),
            data: LineItemCustomFieldType::Float(0.3),
          },
        ],
      },
      LineItemEntity {
        key: Uuid::new_v4(),
        name: String::from("Custom Item 2"),
        description: String::from("Custom Line Item"),
        quantity: 2,
        detail: Some(LineItemDetail::Service(ServiceLineItemEntity {
          service_id: 3,
        })),
        custom_fields: vec![
          LineItemCustomField {
            key: Uuid::new_v4(),
            name: String::from("waived"),
            data: LineItemCustomFieldType::Boolean(true),
          },
          LineItemCustomField {
            key: Uuid::new_v4(),
            name: String::from("factor"),
            data: LineItemCustomFieldType::Integer(2),
          },
        ],
      },
      LineItemEntity {
        key: Uuid::new_v4(),
        name: String::from("Service Item 2"),
        description: String::from("Second Custom Line Item"),
        quantity: 3,
        detail: Some(LineItemDetail::Service(ServiceLineItemEntity {
          service_id: 3,
        })),
        custom_fields: vec![LineItemCustomField {
          key: Uuid::new_v4(),
          name: String::from("waived"),
          data: LineItemCustomFieldType::Boolean(false),
        }],
      },
      LineItemEntity {
        key: Uuid::new_v4(),
        name: String::from("Custom Item 3"),
        description: String::from("Third Custom Line Item"),
        quantity: 1,
        detail: Some(LineItemDetail::Service(ServiceLineItemEntity {
          service_id: 3,
        })),
        custom_fields: vec![],
      },
    ],
  ]
}
