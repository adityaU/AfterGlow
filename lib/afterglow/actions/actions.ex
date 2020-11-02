defmodule AfterGlow.Actions do
  def enum do
    %{ create: 1, update: 2, delete: 3, download: 4 }
  end

  def get_value(value) do
    case value do
      1 -> "CREATE"
      2 -> "UPDATE"
      3 -> "DELETE"
      4 -> "DOWNLOAD"
    end
  end
end
