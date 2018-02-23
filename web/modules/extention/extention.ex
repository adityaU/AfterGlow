defmodule AfterGlow.Extension do
  defmacro extends(module) do
    module = Macro.expand(module, __CALLER__)
    functions = module.__info__(:functions)
    signatures = Enum.map functions, fn { name, arity } ->
      args = if arity == 0 do
          []
        else
          Enum.map 1 .. arity, fn(i) ->
            {:"arg#{i}" , [], nil }
          end
        end
      { name, [], args }
    end
    quote do
      defdelegate unquote(signatures), to: unquote(module)
      defoverridable unquote(functions)
    end
  end
end
