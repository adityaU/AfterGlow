defmodule AfterGlow.Router do
  use AfterGlow.Web, :router

  pipeline :browser do
    plug(:accepts, ["html"])
    plug(:fetch_session)
    plug(:fetch_flash)
    plug(:protect_from_forgery)
    plug(:put_secure_browser_headers)
  end

  pipeline :api do
    plug(:accepts, ["json", "application/vnd.api+json"])
    plug(JaSerializer.Deserializer)
  end

  scope "/api/v1", AfterGlow do
    pipe_through(:api)

    # scope "/auth", MyApp do
    #   get "/:provider", AuthController, :request
    #   get "/:provider/callback", AuthController, :callback
    # end
    post("/query_results", QueryController, :execute)
    get("/sql_autocomplete", AutoCompleteController, :complete)

    get(
      "column_suggestions_autocomplete",
      AutoCompleteController,
      :column_suggestions_autocomplete
    )

    post("/create_csv", DataFilesController, :fetch_and_upload)
    resources("/dashboards", DashboardController)
    resources("/questions", QuestionController)
    resources("/question_banks", QuestionBankController)
    resources("/databases", DatabaseController)
    resources("/tables", TableController, except: [:new, :edi])
    resources("/columns", ColumnController, except: [:new, :edit])
    resources("/users", UserController, except: [:new, :edit])
    resources("/api_actions", ApiActionController)
    resources("/column_values", ColumnValueController, except: [:new, :edit])
    resources("/permission_sets", PermissionSetController, except: [:new, :edit])
    resources("/permissions", PermissionController, except: [:new, :edit])
    resources("/tags", TagController, except: [:new, :edit])
    resources("/variables", VariableController, except: [:new, :edit])
    resources("/snapshots", SnapshotController)
    resources("/widgets", WidgetController)
    resources("/widget_items", WidgetItemController)
    resources("/notes", NoteController)
    resources("/teams", TeamController)
    resources("/alert_settings", AlertSettingController)
    resources("/alert_level_settings", AlertLevelSettingController)
    resources("/alert_notification_settings", AlertNotificationSettingController)
    resources("/user_settings", UserSettingController)
    resources("/settings", SettingController)
    resources("/organization_settings", OrganizationSettingController)
    resources("/organizations", OrganizationController)

    resources("/alert_events", AlertEventController)
    resources("/search_items", SearchItemController)
    resources("/search_tables", SearchTableController)

    resources("/visualizations", VisualizationController)
    post("/visualizations/:id/results", VisualizationController, :results)
    post("/visualizations/results", VisualizationController, :results)
    get("search_tables/:id/foreign_tables", SearchTableController, :foreign_tables)

    post("api_actions/:id/send_request", ApiActionController, :send_request)
    post("api_actions/send_request", ApiActionController, :send_request)
    post("users/:id/activate", UserController, :activate)
    post("users/:id/deactivate", UserController, :deactivate)
    post("questions/:id/results", QuestionController, :results)
    post("questions/query", QuestionController, :get_query)
    post("snapshots/:id/stop_and_new", SnapshotController, :stop_and_new)
    get("snapshots/:snapshot_id/find", SnapshotController, :find)
    get("snapshots/:snapshot_id/suggest", SnapshotController, :suggest)
    get("/explore", ExploreController, :get_row_view)
    post("/explore/create_dashboard", ExploreController, :create_dashboard)
    get("/explore/dependency", ExploreController, :get_dependency_view)
    put("databases/:id/sync", DatabaseController, :sync)
    get("auth/google", AuthController, :google_auth_path)
    post("callback/google", AuthController, :callback)
    post("/verify-token", AuthController, :verify_token)
    post("/login", AuthController, :login_with_password)

    post("/teams/:id/add_user", TeamController, :add_user)
    post("/teams/:id/add_database", TeamController, :add_database)

    post("/teams/:id/remove_user", TeamController, :remove_user)
    post("/teams/:id/remove_database", TeamController, :remove_database)
  end

  # Other scopes may use custom stacks.
  # scope "/api", AfterGlow do
  #   pipe_through :api
  # end
end
