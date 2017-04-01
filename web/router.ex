defmodule SimpleBase.Router do
  use SimpleBase.Web, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json", "application/vnd.api+json"]
    plug JaSerializer.Deserializer
  end

  scope "/api/v1", SimpleBase do
    pipe_through :api 
    
    # scope "/auth", MyApp do
    #   get "/:provider", AuthController, :request
    #   get "/:provider/callback", AuthController, :callback
    # end
   post "/query_results", QueryController, :execute
   resources "/dashboards", DashboardController
   resources "/questions", QuestionController
   resources "/question_banks", QuestionBankController
   resources "/databases", DatabaseController
   resources "/tables", TableController, except: [:new, :edi]
   resources "/columns", ColumnController, except: [:new, :edit]
   resources "/users", UserController, except: [:new, :edit]
   resources "/column_values", ColumnValueController, except: [:new, :edit]
   resources "/permission_sets", PermissionSetController, except: [:new, :edit]
   resources "/permissions", PermissionController, except: [:new, :edit]

   get "questions/:id/results", QuestionController, :results
   get "auth/google", AuthController, :google_auth_path
   post "callback/google", AuthController, :callback
   post "verify-token", AuthController, :verify_token
  end

  # Other scopes may use custom stacks.
  # scope "/api", SimpleBase do
  #   pipe_through :api
  # end
end
