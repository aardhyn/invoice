// @generated automatically by Diesel CLI.

pub mod sql_types {
    #[derive(diesel::query_builder::QueryId, Clone, diesel::sql_types::SqlType)]
    #[diesel(postgres_type(name = "invoice_state"))]
    pub struct InvoiceState;
}

diesel::table! {
    business (business_id) {
        business_id -> Int4,
        name -> Varchar,
        description -> Nullable<Varchar>,
        address -> Nullable<Varchar>,
        suburb -> Nullable<Varchar>,
        city -> Nullable<Varchar>,
        contact_id -> Nullable<Int4>,
        payment_id -> Nullable<Int4>,
    }
}

diesel::table! {
    client (client_id) {
        client_id -> Int4,
        business_id -> Int4,
        contact_id -> Int4,
        name -> Varchar,
        description -> Nullable<Varchar>,
    }
}

diesel::table! {
    contact (contact_id) {
        contact_id -> Int4,
        name -> Varchar,
        email -> Varchar,
        cell -> Varchar,
        address -> Nullable<Varchar>,
        suburb -> Nullable<Varchar>,
        city -> Nullable<Varchar>,
    }
}

diesel::table! {
    use diesel::sql_types::*;
    use super::sql_types::InvoiceState;

    invoice (invoice_id) {
        invoice_id -> Int4,
        invoice_key -> Varchar,
        name -> Varchar,
        description -> Nullable<Varchar>,
        client_id -> Nullable<Int4>,
        business_id -> Int4,
        reference -> Nullable<Varchar>,
        due_date -> Nullable<Timestamptz>,
        line_items -> Jsonb,
        created_timestamp -> Timestamptz,
        address -> Nullable<Varchar>,
        suburb -> Nullable<Varchar>,
        city -> Nullable<Varchar>,
        state -> InvoiceState,
    }
}

diesel::table! {
    invoice_template (invoice_id) {
        invoice_id -> Int4,
    }
}

diesel::table! {
    payment (payment_id) {
        payment_id -> Int4,
        account_number -> Varchar,
        account_name -> Varchar,
    }
}

diesel::table! {
    product (product_id) {
        product_id -> Int4,
        business_id -> Int4,
        name -> Varchar,
        description -> Nullable<Varchar>,
        unit_cost -> Int4,
    }
}

diesel::table! {
    service (service_id) {
        service_id -> Int4,
        business_id -> Int4,
        name -> Varchar,
        description -> Nullable<Varchar>,
        initial_rate -> Int4,
        initial_rate_threshold -> Int4,
        rate -> Int4,
    }
}

diesel::joinable!(business -> contact (contact_id));
diesel::joinable!(business -> payment (payment_id));
diesel::joinable!(client -> business (business_id));
diesel::joinable!(client -> contact (contact_id));
diesel::joinable!(invoice -> business (business_id));
diesel::joinable!(invoice -> client (client_id));
diesel::joinable!(invoice_template -> invoice (invoice_id));
diesel::joinable!(product -> business (business_id));
diesel::joinable!(service -> business (business_id));

diesel::allow_tables_to_appear_in_same_query!(
    business,
    client,
    contact,
    invoice,
    invoice_template,
    payment,
    product,
    service,
);
