set timezone to 'utc';

create domain size as int check (value >= 0);

create type State as enum ('draft', 'pending', 'paid');

create table location (
  location_id serial primary key,
  address varchar not null,
  suburb varchar null,
  city varchar not null
);

create table payment (
  payment_id serial primary key,
  account_number varchar not null unique,
  account_name varchar not null
);

create table contact (
  contact_id serial primary key,
  location_id int null references location(location_id) on delete cascade,
  name varchar not null unique,
  email varchar not null,
  cell varchar not null
);

create table business (
  business_id serial primary key,
  payment_id int null references payment(payment_id) on delete cascade,
  contact_id int null references contact(contact_id) on delete cascade,
  location_id int null references location(location_id) on delete cascade,
  name varchar not null,
  description varchar null
);

create table service (
  service_id serial primary key,
  business_id int not null references business(business_id) on delete cascade,
  name varchar not null unique,
  description varchar null,
  initial_rate size not null default 0,
  initial_rate_threshold size not null default 0,
  rate size not null
);

create table product (
  product_id serial primary key,
  business_id int not null references business(business_id) on delete cascade,
  name varchar not null unique,
  description varchar null,
  unit_cost size not null
);

create table client (
  client_id serial primary key,
  business_id int not null references business(business_id) on delete cascade,
  contact_id int not null references contact(contact_id) on delete cascade,
  name varchar not null,
  description varchar null
);

create table invoice (
  invoice_id serial primary key,
  invoice_key varchar unique not null,
  name varchar not null,
  description varchar null,
  business_id int not null references business(business_id) on delete cascade,
  reference varchar null,
  due_date timestamp with time zone null,
  line_items jsonb not null default '[]'::jsonb,
  client_id int null references client(client_id) on delete set null,
  client_data jsonb null,
  location_id int null references location(location_id) on delete cascade,
  location_data jsonb null,
  created_timestamp timestamp with time zone not null default now()
  state State not null default 'draft'
);

create table invoice_template (
  invoice_id int primary key references invoice(invoice_id) on delete cascade
);
