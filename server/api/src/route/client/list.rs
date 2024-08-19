use repository::service::{self, ClientList};
use rocket::http::Status;

use crate::util::response::APIResponse;
#[get("/client.list")]
pub fn client_list() -> APIResponse<ClientList, String> {
  service::list_clients().map_or_else(
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
