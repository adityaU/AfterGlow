defmodule AfterGlow.Policy.Helpers do
  def permissions(user) do
    user.permission_sets
    |> Enum.map(fn x ->
      x.permissions
      |> Enum.map(fn y ->
        y.name
      end)
    end)
    |> List.flatten
  end

  def has_permission(user, permission) when is_binary(permission) do
    user |> permissions |> Enum.member?(permission)
  end
  
  def has_permission(user, permissionList) when is_list(permissionList) do
    permissionList
    |> Enum.map(fn permission ->
      user |> permissions |> Enum.member?(permission)
    end)
    |> Enum.any?(fn x -> x end)
  end
end
