use rocket::{
  http::Status,
  request::{FromRequest, Outcome},
  Request,
};
use std::env;

const DEV_KEY_COOKIE: &str = "dev-key";

fn is_valid_dev_key(key: &str) -> bool {
  key == env::var("API_DEV_KEY").expect("API_DEV_KEY not found!")
}

pub struct DevKey;

#[derive(Debug)]
pub enum DevKeyError {
  Missing,
  Invalid,
}

#[rocket::async_trait]
impl<'k> FromRequest<'k> for DevKey {
  type Error = DevKeyError;
  async fn from_request(req: &'k Request<'_>) -> Outcome<Self, Self::Error> {
    let key = req.cookies().get(DEV_KEY_COOKIE);
    match key {
      None => Outcome::Error((Status::Unauthorized, DevKeyError::Missing)),
      Some(key) if is_valid_dev_key(key.value()) => Outcome::Success(DevKey),
      Some(_) => Outcome::Error((Status::Unauthorized, DevKeyError::Invalid)),
    }
  }
}
