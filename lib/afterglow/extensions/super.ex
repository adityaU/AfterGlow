defmodule AfterGlow.Postgrex.Extensions.Super do
  @moduledoc false
  @behaviour Postgrex.Extension
  import Postgrex.BinaryUtils, warn: false

  def init(opts) do
    json =
      Keyword.get_lazy(opts, :json, fn ->
        Application.get_env(:postgrex, :json_library, Jason)
      end)

    {json, Keyword.get(opts, :decode_binary, :copy)}
  end

  def matching({nil, _}),
    do: []

  def matching(_),
    do: [type: "super"]

  def format(_),
    do: :binary

  def encode({library, _}) do
    quote location: :keep do
      map ->
        data = unquote(library).encode_to_iodata!(map)
        [<<IO.iodata_length(data)::int32>> | data]
    end
  end

  def decode({library, :copy}) do
    quote location: :keep do
      <<len::int32, json::binary-size(len)>> ->
        json
        |> :binary.copy()
        |> unquote(library).decode!()
    end
  end

  def decode({library, :reference}) do
    quote location: :keep do
      <<len::int32, json::binary-size(len)>> ->
        unquote(library).decode!(json)
    end
  end
end
