defmodule AfterGlow.Repo.Migrations.UpdateToVariablePaneWidget do
  use Ecto.Migration
  alias AfterGlow.Repo

  alias AfterGlow.Dashboards.QueryFunctions, as: Dashboards

  def up do
    {:ok, dashboards} = Dashboards.list()
    dashboards = dashboards |> Repo.preload([:variables])

    refreshIconHTML =
      ~s[<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-refresh" width="16px" height="16px" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>   <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4"></path>   <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4"></path> </svg>]

    resetIconHTML =
      ~s[<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-arrow-back-up" width="16px" height="16px" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>   <path d="M9 13l-4 -4l4 -4m-4 4h11a4 4 0 0 1 0 8h-1"></path> </svg>]

    clearIconHTML =
      ~s[<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-clear-all" width="16px" height="16px" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>   <path d="M8 6h12"></path>   <path d="M6 12h12"></path>   <path d="M4 18h12"></path> </svg>]

    variable_pane = %{
      displayShow: true,
      type: "variablePane",
      show: true,
      formattingSettings: %{
        backgroundColor: "transparent",
        borderColor: "transparent",
        borderRadius: 0.125,
        borderThickness: 0,
        gapAround: 0.125,
        headerBackgroundColor: "white",
        headerTextColor: "#6e7687",
        shadow: "none",
        showHeader: true
      },
      additionalParams: %{
        name: "Variables Row 1",
        variableIDs: [],
        buttonName: "Refresh",
        showRefreshButton: true,
        clearButtonName: "Clear",
        resetButtonName: "Reset",
        showClearButton: true,
        showResetButton: true,
        refreshButtonFormatting: %{
          backgroundColor: "#6574cd",
          borderColor: "#6574cd",
          borderThickness: 1,
          fontSize: 1,
          fontWeight: "semibold",
          textColor: "white",
          paddingX: 1,
          paddingY: 0.5,
          icon: refreshIconHTML,
          iconOnly: false
        },
        clearButtonFormatting: %{
          backgroundColor: "white",
          borderColor: "#e5e7eb",
          borderThickness: 1,
          fontSize: 1,
          fontWeight: "semibold",
          textColor: "#6e7687",
          paddingX: 1,
          paddingY: 0.5,
          icon: clearIconHTML,
          iconOnly: false
        },
        resetButtonFormatting: %{
          backgroundColor: "#e5e7eb",
          borderColor: "#e5e7eb",
          borderThickness: 1,
          fontSize: 1,
          fontWeight: "semibold",
          textColor: "#6e7687",
          paddingX: 1,
          paddingY: 0.5,
          icon: resetIconHTML,
          iconOnly: false
        }
      },
      widID: Enum.random(0..1_000_000_000_000),
      w: 12,
      h: 5,
      y: 0,
      x: 0
    }

    dashboards
    |> Enum.each(fn d ->
      widgets = get_in(d.settings, ["widgets"])

      if widgets do
        if !(widgets |> Enum.find(&(get_in(&1, ["type"]) == "variablePane"))) do
          if d.variables |> length() > 0 do
            variable_pane =
              put_in(
                variable_pane,
                [:additionalParams, :variableIDs],
                d.variables
                |> Enum.map(fn v -> v.id end)
              )

            widgets =
              widgets
              |> Enum.map(fn w ->
                put_in(w, ["y"], w["y"] + 5)
              end)

            widgets = widgets ++ [variable_pane]
            settings = d.settings
            settings = put_in(settings, ["widgets"], widgets)
            Dashboards.update(d, %{settings: settings})
          end
        end
      end
    end)
  end

  def down do
  end
end
