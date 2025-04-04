use super::contact::Contact;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Client {
  pub client_id: i32,
  pub name: String,
  pub description: Option<String>,
  pub contact: Contact,
}
