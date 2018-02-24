%{
  afterglow: %{
    admin_email: {:flasked, :AG_ADMIN_EMAIL, :string, "admin@example.com"},
    allowed_google_domain: {:flasked, :AG_ALLOWED_GOOGLE_DOMAIN, :string, ".*"},
    google_client_id: {:flasked, :AG_GOOGLE_CLIENT_ID, :string, "none"},
    google_client_secret: {:flasked, :AG_GOOGLE_CLIENT_SECRET, :string, "none"},
    app_root: {:flasked, :AG_APP_ROOT, :string, "http://localhost:4000"},
    s3_bucket: {:flasked, :AG_S3_BUCKET, :string, "fileUpload"},
    aws_region: {:flasked, :AG_AWS_REGION, :string, "ap-southeast-1"},
    email_server: {:flasked, :AG_EMAIL_SERVER, :string, "server"},
    email_hostname: {:flasked, :AG_EMAIL_HOSTNAME, :string, "afterglow"},
    email_port: {:flasked, :AG_EMAIL_PORT, :string, "587"},
    email_username: {:flasked, :AG_EMAIL_USERNAME, :string, "username"},
    email_password: {:flasked, :AG_EMAIL_PASSWORD, :string, "password"},
    sender_email_id: {:flasked, :AG_SENDER_EMAIL_ID, :string, "info@example.com"}

  }
}
#export AWS_ACCESS_KEY_SECRET=""
#export AWS_ACCESS_KEY_ID=""
