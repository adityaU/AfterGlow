defmodule AfterGlow.Mailers.CsvMailer do
  alias AfterGlow.Mailers
  import Bamboo.Mailer
  import Bamboo.Email

  def mail(to, link, data_preview) do
    mail(to, link, "Please download your CSV", data_preview)
  end

  def mail(to, link, subject, data_preview) do
    email =
      to
      |> Mailers.define_mailer()
      |> subject(subject)
      |> html_body(mail_html_body(data_preview, link))
      |> text_body("please download your csv from #{link}")

    deliver_later(Bamboo.SMTPAdapter, email, Mailers.config())
  end

  defp mail_html_body(data_preview, link) do
    "Please download complete csv from <a href=#{link}>here</a> <br/> <br/> <table border='1' cellpadding='10' style='border-collapse:collapse; border-color: lightgray;'><thead><tr>" <>
      headers(data_preview) <> "</tr></thead><tbody>" <> body(data_preview) <> "</tbody></table>"
  end

  defp headers(data_preview) do
    data_preview
    |> Enum.at(0)
    |> Enum.map(fn header ->
      "<th>" <> to_string(header) <> "</th>"
    end)
    |> Enum.join("")
  end

  def body(data_preview) do
    data_preview
    |> Enum.slice(1..-1)
    |> Enum.map(fn row ->
      "<tr>" <>
        (row |> Enum.map(fn el -> "<td>" <> to_string(el) <> "</td>" end) |> Enum.join("")) <>
        "</tr>"
    end)
    |> Enum.join("")
  end
end
