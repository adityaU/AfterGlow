defmodule AfterGlow.Settings.ApplicableSettings do
  alias AfterGlow.Settings.GlobalSettingsQueryFunctions, as: GlobalSettings
  alias AfterGlow.Settings.UserSettingsQueryFunctions, as: UserSettings
  alias AfterGlow.Settings.OrganizationSettingsQueryFunctions, as: OrganizationSettings

  def use_signed_s3_url_in_emails() do
    global_setting_by_name("USE_SIGNED_S3_URLS_IN_MAILS") == "true"
  end

  def signed_s3_url_timeout() do
    global_setting_by_name("S3_SIGNED_URL_TIMEOUT") |> String.to_integer
  end

  def email_server() do
    global_setting_by_name("EMAIL_SERVER")
  end

  def sender_email_id() do
    global_setting_by_name("SENDER_EMAIL_ID")
    |> IO.inspect(label: "sender_email")
  end

  def email_hostname() do
    global_setting_by_name("EMAIL_SERVER_HOSTNAME")
  end

  def email_username() do
    global_setting_by_name("EMAIL_USERNAME")
  end

  def email_password() do
    global_setting_by_name("EMAIL_PASSWORD")
  end

  def email_port() do
    global_setting_by_name("EMAIL_PORT")
    |> to_integer()
  end

  def aws_access_key_id() do
    global_setting_by_name("AWS_ACCESS_KEY_ID")
  end

  def aws_secret_access_key() do
    global_setting_by_name("AWS_SECRET_ACCESS_KEY")
  end

  def aws_region() do
    global_setting_by_name("AWS_REGION")
  end

  def s3_bucket() do
    global_setting_by_name("S3_BUCKET")
  end

  def max_frontend_limit(user) do
    limit = get_by_applicablity_order("MAX_FRONTEND_LIMIT", user)

    if !limit || limit > 2000, do: 2000, else: limit
  end

  def max_download_limit(user) do
    get_by_applicablity_order("MAX_DOWNLOAD_LIMIT", user)
  end

  def global_max_download_limit() do
    global_setting_by_name("MAX_DOWNLOAD_LIMIT")
  end

  def can_download_reports(user) do
    get_by_applicablity_order_boolean("DOWNLOAD_ALLOWED", user)
  end

  def get_by_applicablity_order(name, user) do
    user_setting_by_name(name, user.id) ||
      organization_setting_by_name(name, user.organization_id) ||
      global_setting_by_name(name)
  end

  def get_by_applicablity_order_boolean(name, user) do
    user_setting_by_name(name, user.id) ||
      (organization_setting_by_name(name, user.organization_id) || "true") ||
      global_setting_by_name(name)
  end

  def global_setting_by_name(name) do
    GlobalSettings.find_by_name(name)
  end

  def user_setting_by_name(name, user_id) do
    UserSettings.find_by_name(name, user_id)
  end

  def organization_setting_by_name(_name, nil), do: nil

  def organization_setting_by_name(name, org_id) do
    OrganizationSettings.find_by_name(name, org_id)
  end

  def to_integer(nil), do: nil

  def to_integer(string) when is_binary(string) do
    string |> String.to_integer()
  end
end
