use axum::Router;

pub async fn start_service(port: String, origin: String, service: Router) -> Result<(), String> {
  let listener = tokio::net::TcpListener::bind(format!("{origin}:{port}"))
    .await
    .map_err(|e| format!("Failed to bind to port: {}", e))?;

  axum::serve(listener, service)
    .await
    .map_err(|e| format!("Failed to start server: {}", e))?;

  Ok(())
}
