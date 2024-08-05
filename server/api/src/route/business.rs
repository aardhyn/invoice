use axum::{http::StatusCode, Json};
use repository::service::{self, BusinessList, CreateBusiness, CreatedBusiness};

pub async fn business_create(
  Json(payload): Json<CreateBusiness>,
) -> (StatusCode, Json<CreatedBusiness>) {
  service::create_business(payload)
    .map(|created_business| (StatusCode::CREATED, Json(created_business)))
    .unwrap_or_else(|error| {
      eprintln!("Error creating business: {:?}", error);
      (
        StatusCode::INTERNAL_SERVER_ERROR,
        Json(CreatedBusiness {
          business_id: 0,
          name: String::from(""),
        }),
      )
    })
}

pub async fn business_list() -> (StatusCode, Json<BusinessList>) {
  service::list_businesses()
    .map(|list| (StatusCode::OK, Json(list)))
    .unwrap_or_else(|error| {
      eprintln!("Error listing businesses: {:?}", error);
      (
        StatusCode::INTERNAL_SERVER_ERROR,
        Json(BusinessList { businesses: vec![] }),
      )
    })
}
