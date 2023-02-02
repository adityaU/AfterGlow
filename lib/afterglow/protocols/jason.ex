defmodule AfterGlow.Protocols.Jason do
  alias Jason.Encoder

  defimpl Encoder, for: Tuple do
    def encode(data, options) when is_tuple(data) do
      data
      |> Tuple.to_list()
      |> Encoder.List.encode(options)
    end
  end

  defimpl Encoder, for: PID do
    def encode(_pid, options) do
      ["PID"]
      |> Encoder.List.encode(options)
    end
  end
end
