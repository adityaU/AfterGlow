defmodule AfterGlow.Mailers do
  import Bamboo.Email
  import AfterGlow.Utils.DomainChecks
  alias AfterGlow.Settings.ApplicableSettings

  def config do
    %{
      tls: :if_available,
      retries: 2,
      server:
        "#{ApplicableSettings.email_server() || Application.get_env(:afterglow, :email_server)}",
      hostname:
        "#{
          ApplicableSettings.email_hostname() || Application.get_env(:afterglow, :email_hostname)
        }",
      port:
        "#{
          ApplicableSettings.email_port() ||
            Application.get_env(:afterglow, :email_port) |> String.to_integer()
        }",
      username:
        "#{
          ApplicableSettings.email_username() || Application.get_env(:afterglow, :email_username)
        }",
      password:
        "#{
          ApplicableSettings.email_password() || Application.get_env(:afterglow, :email_password)
        }",
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
end
