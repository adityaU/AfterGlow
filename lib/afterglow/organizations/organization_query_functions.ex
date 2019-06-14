defmodule AfterGlow.Organizations.OrganizationsQueryFunctions do
  @model AfterGlow.Organizations.Organization
  @default_preloads [:users]
  use AfterGlow.Utils.Models.Crud
  alias AfterGlow.Settings.OrganizationSettingsQueryFunctions, as: OrganizationSettings

  def find_by_google_domain(domain) do
    Repo.get_by(@model, google_domain: domain)
  end

  def create(params) do
    case _create(params) do
      {:ok, org} ->
        OrganizationSettings.verify_general_settings(org.id)
        {:ok, org}

      {:error, error} ->
        {:error, error}
    end
  end
end
