defmodule AfterGlow.OrganizationController do
  use AfterGlow.Web, :controller
  @model_type "organizations"
  @model AfterGlow.Organizations.Organization
  @query_functions AfterGlow.Organizations.OrganizationsQueryFunctions

  alias AfterGlow.Plugs.Authorization
  plug(Authorization)
  plug(:authorize!, @model)
  plug(:verify_authorized)

  action_fallback(AfterGlow.Web.FallbackController)
  use AfterGlow.Utils.Controllers.Crud

  def delete(_conn, _params), do: {:error, :not_allowed}
end
