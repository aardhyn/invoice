// @generated automatically by Diesel CLI.

diesel::table! {
    business (business_id) {
        business_id -> Int4,
        payment_id -> Nullable<Int4>,
        contact_id -> Nullable<Int4>,
        location_id -> Nullable<Int4>,
        name -> Varchar,
        description -> Nullable<Varchar>,
    }
}

diesel::table! {
    client (client_id) {
        client_id -> Int4,
        contact_id -> Int4,
        name -> Varchar,
        description -> Nullable<Varchar>,
    }
}

diesel::table! {
    contact (contact_id) {
        contact_id -> Int4,
        location_id -> Nullable<Int4>,
        name -> Varchar,
        email -> Varchar,
        cell -> Varchar,
    }
}

diesel::table! {
    invoice (invoice_id) {
        invoice_id -> Int4,
        name -> Varchar,
        description -> Nullable<Varchar>,
        reference -> Nullable<Varchar>,
        due_date -> Timestamptz,
        line_items -> Jsonb,
        payment_data -> Jsonb,
        business_id -> Int4,
        client_id -> Int4,
        client_data -> Jsonb,
        location_id -> Int4,
        location_data -> Jsonb,
        created_timestamp -> Timestamptz,
    }
}

diesel::table! {
    location (location_id) {
        location_id -> Int4,
        address -> Varchar,
        suburb -> Nullable<Varchar>,
        city -> Varchar,
    }
}

diesel::table! {
    payment (payment_id) {
        payment_id -> Int4,
        account_number -> Varchar,
        account_name -> Varchar,
    }
}

diesel::joinable!(business -> contact (contact_id));
diesel::joinable!(business -> location (location_id));
diesel::joinable!(business -> payment (payment_id));
diesel::joinable!(client -> contact (contact_id));
diesel::joinable!(contact -> location (location_id));
diesel::joinable!(invoice -> business (business_id));
diesel::joinable!(invoice -> client (client_id));
diesel::joinable!(invoice -> location (location_id));

diesel::allow_tables_to_appear_in_same_query!(
    business,
    client,
    contact,
    invoice,
    location,
    payment,
);
