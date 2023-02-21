defmodule AfterGlow.Users.QueryFunctions do
  @model AfterGlow.User
  @default_preloads []
  import Ecto.Query

  use AfterGlow.Utils.Models.Crud

  alias AfterGlow.PermissionSets.QueryFunctions, as: PermissionSets
  alias AfterGlow.Organizations.OrganizationsQueryFunctions, as: Organizations
  alias AfterGlow.Settings.UserSettingsQueryFunctions, as: UserSettings

  def get_by_email(email) do
    users = from(m in @model, where: m.email == ^email) |> Repo.all()
    if users |> length() > 0, do: users |> Enum.at(0), else: nil
  end

  def system_user do
    from(m in @model, where: m.email == "AG::System")
    |> Repo.one()
  end

  # def send_welcome_email(u) do

  #   CsvMailer.mail_generic(
  #     u.email,
  #     "Welcome to Afterglow",
  #     html,
  #     "Hi,\n\nWelcome to Afterglow!\nYou ca"
  #   )

  # end

  def create_bulk(emails, permission_set_id) do
    {:ok, ps} = PermissionSets.get(permission_set_id)
    active_domains = Organizations.active_domains()

    emails
    |> Enum.map(fn email ->
      if validate_email(email, active_domains) do
        user = get_by_email(email)

        if !user do
          {:ok, user} = create(%{email: email})
          PermissionSets.add_user(user.id, ps.id)
          UserSettings.create_default_settings(user.id)
          user
        else
          user
        end
      else
        nil
      end
    end)
    |> Enum.filter(& &1)
  end

  defp validate_email(email, accepted_domains) when is_binary(email) do
    case Regex.run(~r/^[\w.!#$%&’*+\-\/=?\^`{|}~]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*$/i, email) do
      nil ->
        false

      [email, _rest] ->
        try do
          Regex.run(~r/(\w+)@([\w.]+)/, email) |> validate_email(accepted_domains)
        rescue
          _ -> false
        end
    end
  end

  defp validate_email([_email, _username, _host], []) do
    :ok
  end

  # check the email against a list of accepted domains, then make check if it is unique
  defp validate_email([_email, _username, host], accepted_domains) do
    host in accepted_domains
  end
end
