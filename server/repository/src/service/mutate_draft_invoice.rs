use crate::connection::establish_connection;
use crate::model::*;
use crate::utility::invoice::get_invoice_state;
use crate::utility::location::Location;
use chrono::{DateTime, Utc};
use diesel::prelude::*;
use diesel::result::Error;
use diesel::{ConnectionError, SelectableHelper};
use serde::{Deserialize, Serialize};
use std::fmt;

#[derive(Debug)]
pub enum MutateDraftInvoiceError {
  NotDraftInvoice,
  InvoiceNotFound,
  InvalidClient,
  InvalidLocation,
  ConnectionError(ConnectionError),
  UnknownError(Error),
}

impl fmt::Display for MutateDraftInvoiceError {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    write!(f, "{:?}", self)
  }
}

impl From<Error> for MutateDraftInvoiceError {
  fn from(error: Error) -> Self {
    MutateDraftInvoiceError::UnknownError(error)
  }
}

pub type MutatedDraftInvoice = CreatedInvoiceEntity;

#[derive(Deserialize, Serialize)]
#[serde(untagged)]
pub enum DraftInvoiceClientMutation {
  Build(CreateClientEntity),
  Existing(i32),
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DraftInvoiceMutation {
  pub invoice_id: i32,
  pub name: Option<String>,
  pub description: Option<String>,
  pub reference: Option<String>,
  pub client: Option<DraftInvoiceClientMutation>,
  pub due_date: Option<DateTime<Utc>>,
  pub location: Option<Location>,
}

pub fn create_or_fetch_client(
  client: DraftInvoiceClientMutation,
  connection: &mut PgConnection,
) -> Result<i32, MutateDraftInvoiceError> {
  match client {
    DraftInvoiceClientMutation::Build(create_client) => {
      let new_client = diesel::insert_into(crate::schema::client::table)
        .values(&create_client)
        .returning(crate::schema::client::client_id)
        .get_result(connection)
        .map_err(|error| match error {
          Error::NotFound => MutateDraftInvoiceError::InvalidClient,
          _ => MutateDraftInvoiceError::UnknownError(error),
        })?;
      Ok(new_client)
    }
    DraftInvoiceClientMutation::Existing(client_id) => Ok(client_id),
  }
}

pub fn mutate_draft_invoice(
  mutation: DraftInvoiceMutation,
) -> Result<MutatedDraftInvoice, MutateDraftInvoiceError> {
  use crate::schema::invoice;

  let connection = &mut establish_connection().map_err(MutateDraftInvoiceError::ConnectionError)?;

  let state = get_invoice_state(mutation.invoice_id, connection)?;
  if state != InvoiceState::Draft {
    return Err(MutateDraftInvoiceError::NotDraftInvoice);
  }

  let client_id = mutation
    .client
    .map(|client| create_or_fetch_client(client, connection))
    .transpose()?;

  let (address, suburb, city) = match mutation.location {
    Some(location) => (Some(location.address), location.suburb, Some(location.city)),
    None => (None, None, None),
  };

  let mutated_invoice = diesel::update(invoice::table.find(mutation.invoice_id))
    .set(DraftInvoiceEntityMutation {
      name: mutation.name,
      description: mutation.description,
      reference: mutation.reference,
      due_date: mutation.due_date,
      client_id,
      address,
      suburb,
      city,
    })
    .returning(MutatedDraftInvoice::as_returning())
    .get_result(connection)
    .map_err(|error| match error {
      Error::NotFound => MutateDraftInvoiceError::InvoiceNotFound,
      _ => MutateDraftInvoiceError::UnknownError(error),
    })?;

  Ok(mutated_invoice)
}
