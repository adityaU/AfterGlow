defmodule AfterGlow.SnapshotsTasks do
  alias AfterGlow.Snapshots
  alias AfterGlow.Mailers.SnapshotMailer

  def save(snapshot, email_id) do
    Snapshots.save_data(snapshot)
    link = "#{Application.get_env(:afterglow, :app_root)}questions/#{snapshot.question_id}/snapshots/#{snapshot.id}"
    SnapshotMailer.mail(email_id, snapshot, link )
  end
end

  
