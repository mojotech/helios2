defmodule HeliosWeb.Schema.Types.EmployeeEventCollection do
  use Absinthe.Schema.Notation

  object :employee_event_collection do
    field(:birthday_employees, list_of(:employee))
    field(:anniversary_employees, list_of(:employee))
    field(:time_off_employees, list_of(:employee))
  end
end
