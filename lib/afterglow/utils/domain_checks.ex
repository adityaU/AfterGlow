defmodule AfterGlow.Utils.DomainChecks do
  alias AfterGlow.Organizations.OrganizationsQueryFunctions, as: Organizations

  def match_domain(to) do
    regex_match(to) || comma_seperated_domains(to) || in_organizations(to)
  end

  defp in_organizations(to) do
    all_org_domains()
    |> Enum.member?(to |> String.split("@") |> Enum.at(-1))
  end

  defp comma_seperated_domains(to) do
    Application.get_env(:afterglow, :allowed_google_domain)
    |> String.split(",")
    |> Enum.map(&(&1 |> String.trim()))
    |> Enum.member?(to |> String.split("@") |> Enum.at(-1))
  end

  defp regex_match(to) do
    env_var_domains = Application.get_env(:afterglow, :allowed_google_domain)

    env_var_domains =
      env_var_domains
      |> String.split(",")
      |> Enum.map(&(&1 |> String.trim()))
      |> Enum.filter(&(&1 != ""))

    all_domains = env_var_domains ++ all_org_domains()

    if all_domains |> length == 0 do
      true
    else
      to in all_domains
    end
  end

  defp all_org_domains() do
    Organizations.active_domains()
  end
end
