use repository::service::{self, ClientList};
use rocket::{http::Status, serde::json::Json};
use serde::Deserialize;

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ClientListParams {
  pub business_id: i32,
}

use crate::util::response::APIResponse;
#[post("/client.list", data = "<data>")]
pub fn client_list(data: Json<ClientListParams>) -> APIResponse<ClientList, String> {
  service::list_clients(data.business_id).map_or_else(
    |e| APIResponse {
      status: Some(Status::BadRequest),
      data: None,
      error: Some(e.to_string()),
    },
    |clients| APIResponse {
      status: Some(Status::Ok),
      data: Some(clients),
      error: None,
    },
  )
}
