defmodule AfterGlow.Mailers.CsvMailer do
  alias AfterGlow.Mailers
  import Bamboo.Mailer
  import Bamboo.Email
  def mail(to, link) do
    email = to
    |> Mailers.define_mailer
    |> subject("Please download your CSV")
    |> html_body("please download your csv from <a href=#{link}>here</a>")
    |> text_body("please download your csv from #{link}")
    deliver_later( Bamboo.SMTPAdapter, email, Mailers.config )
  end
end
