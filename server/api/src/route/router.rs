use axum::{
  routing::{get, post},
  Router,
};

use super::business::{business_create, business_list};

pub fn build_router() -> Router {
  Router::new()
    .route("/business.create", post(business_create))
    .route("/business.list", get(business_list))
}
