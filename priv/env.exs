%{
  afterglow: %{
    admin_email: {:flasked, :AG_ADMIN_EMAIL, :string, "admin@example.com"},
    allowed_google_domain: {:flasked, :AG_ALLOWED_GOOGLE_DOMAIN, :string, ".*"},
    google_client_id: {:flasked, :AG_GOOGLE_CLIENT_ID, :string, "none"},
    google_client_secret: {:flasked, :AG_GOOGLE_CLIENT_SECRET, :string, "none"},
    app_root: {:flasked, :AG_APP_ROOT, :string, "http://localhost:4000"}
  }
}
