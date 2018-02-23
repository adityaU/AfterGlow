defmodule AfterGlow.Mailers do
  import Bamboo.Email

  def config do
    %{
      tls: :if_available,
      retries: 2,
      server: "#{Application.get_env(:afterglow, :email_server)}",
      hostname: "#{Application.get_env(:afterglow, :email_hostname)}",
      port: "#{Application.get_env(:afterglow, :email_port) |> String.to_integer}",
      username: "#{Application.get_env(:afterglow, :email_username)}",
      password: "#{Application.get_env(:afterglow, :email_password)}",
      deliver_later_strategy: Bamboo.TaskSupervisorStrategy,
      transport: :gen_smtp_client
    }
  end

  def define_mailer(to) do
    new_email
    |> to(to)
    |> from(Application.get_env(:afterglow, :sender_email_id))
  end
end
