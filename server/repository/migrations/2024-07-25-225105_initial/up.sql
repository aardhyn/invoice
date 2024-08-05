create table location (
  location_id serial primary key,
  address varchar not null,
  suburb varchar not null,
  city varchar not null
);

create table payment (
  payment_id serial primary key,
  account_number varchar not null unique,
  account_name varchar not null
);

create table contact (
  contact_id serial primary key,
  location_id int not null references location(location_id),
  name varchar not null unique,
  email varchar not null,
  cell varchar not null
);

create table business (
  business_id serial primary key,
  payment_id int references payment(payment_id),
  contact_id int references contact(contact_id),
  location_id int references location(location_id),
  name varchar not null
);

