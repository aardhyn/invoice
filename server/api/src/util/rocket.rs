use std::{env, net::IpAddr};

use rocket::Config;

pub fn build_config() -> Result<Config, String> {
  let port = env::var("API_PORT")
    .map_err(|_| String::from("API_PORT must be set"))?
    .parse::<u16>()
    .map_err(|_| String::from("API_PORT must be a valid u16"))?;

  let address = IpAddr::from([0, 0, 0, 0]);

  let config = Config {
    address,
    port,
    ..Config::debug_default()
  };

  Ok(config)
}
