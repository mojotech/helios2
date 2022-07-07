defmodule Mix.Tasks.CreateAdmin do
  use Mix.Task

  alias Helios.Accounts

  def run(args) do
    user_email = Enum.at(args, 0)
    user_pw = Enum.at(args, 1)

    Application.ensure_all_started(:helios)

    case Accounts.register_admin(%{email: user_email, password: user_pw}) do
      {:error, _changeset} ->
        IO.puts(
          "Failed: bad input. Make sure user doesnt already exist, and password meets constraints"
        )

      {:ok, _response} ->
        confirm_admin(user_email)
    end
  end

  defp confirm_admin(email) do
    Helios.Repo.get_by(Helios.Accounts.Admin, email: email)
    |> Ecto.Changeset.change(%{confirmed_at: NaiveDateTime.local_now()})
    |> Helios.Repo.update()
  end
end
