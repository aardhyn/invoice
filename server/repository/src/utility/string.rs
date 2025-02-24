/**
 * Extracts the trailing number from a string
 */
pub fn extract_trailing_integer(string: &String) -> i32 {
  if let Some(last_world) = string.split_whitespace().last() {
    if let Ok(number) = last_world.parse::<i32>() {
      return number;
    };
  };
  0
}
