defmodule AfterGlow.Mailers.SnapshotMailer do
  alias AfterGlow.Mailers
  import Bamboo.Email
  import Bamboo.Mailer

  def mail(to, snapshot, link) do
    email =
      to
      |> Mailers.define_mailer()
      |> subject("Your Snapshot: #{snapshot.name} is ready.")
      |> html_body("Your Snapshot is ready.Please Visit this <a href=#{link}>link</a>")
      |> text_body("Your Snapshot is ready. Please visit this link: #{link}")

    deliver_later(Bamboo.SMTPAdapter, email, Mailers.config())
  end
end
