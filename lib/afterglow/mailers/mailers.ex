defmodule AfterGlow.Mailers do
  import Bamboo.Email

  def config do
    %{
      tls: :if_available,
      retries: 2,
      server: "#{Application.get_env(:afterglow, :email_server)}",
      hostname: "#{Application.get_env(:afterglow, :email_hostname)}",
      port: "#{Application.get_env(:afterglow, :email_port) |> String.to_integer()}",
      username: "#{Application.get_env(:afterglow, :email_username)}",
      password: "#{Application.get_env(:afterglow, :email_password)}",
      deliver_later_strategy: Bamboo.TaskSupervisorStrategy,
      transport: :gen_smtp_client
    }
  end

  def define_mailer(to) do
    to = filter_to(to)

    new_email()
    |> to(to)
    |> from(Application.get_env(:afterglow, :sender_email_id))
  end

  defp filter_to(to) when is_list(to) do
    to
    |> Enum.filter(fn x -> match_domain(x) end)
  end

  defp filter_to(to) when is_binary(to) do
    if match_domain(to), do: to, else: nil
  end

  defp match_domain(to) do
    Regex.match?(~r/#{Application.get_env(:afterglow, :allowed_google_domain)}/, to)
  end
end
