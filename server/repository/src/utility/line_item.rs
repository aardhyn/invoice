use crate::model::*;

// todo: make unsigned

pub fn compute_service_total(service: &ServiceEntity, quantity: i32) -> i32 {
  let rate = if quantity < service.initial_rate_threshold {
    service.initial_rate
  } else {
    service.rate
  };
  rate * quantity
}

pub fn compute_product_total(product: &ProductEntity, quantity: i32) -> i32 {
  product.unit_cost * quantity
}
