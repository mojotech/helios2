defmodule Helios.Accounts.AdminUserAdmin do
  alias HeliosWeb.Router.Helpers, as: Routes

  def custom_links(_schema) do
    [
      %{
        name: "Log Out",
        url: Routes.admin_user_session_path(HeliosWeb.Endpoint, :delete),
        method: :delete,
        icon: "sign-out-alt",
        location: :top
      }
    ]
  end
end
