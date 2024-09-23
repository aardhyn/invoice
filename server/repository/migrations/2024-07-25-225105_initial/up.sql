set timezone to 'utc';

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
  location_id int not null references location(location_id) on delete cascade,
  name varchar not null unique,
  email varchar not null,
  cell varchar not null
);

create table business (
  business_id serial primary key,
  payment_id int references payment(payment_id) on delete cascade,
  contact_id int references contact(contact_id) on delete cascade,
  location_id int references location(location_id) on delete cascade,
  name varchar not null,
  description varchar null
);

create table client (
  client_id serial primary key,
  contact_id int not null references contact(contact_id) on delete cascade,
  name varchar not null,
  description varchar null
);

create table invoice (
  invoice_id serial primary key,
  name varchar not null,
  description varchar null,
  due_date timestamp with time zone not null,
  line_items jsonb not null default '[]'::jsonb,
  payment_data jsonb not null,
  business_id int not null references business(business_id) on delete cascade,
  client_id int not null references client(client_id) on delete set null,
  client_data jsonb not null,
  location_id int not null references location(location_id) on delete cascade,
  location_data jsonb not null,
  created_timestamp timestamp with time zone not null default now()
);