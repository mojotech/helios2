class Types::EmployeeEventCollectionType < Types::BaseObject
  field :birthday_employees, [Types::EmployeeType]
  field :anniversary_employees, [Types::EmployeeType]
  field :time_off_employees, [Types::EmployeeType]

  field :all, [Types::EmployeeType]

  delegate :all, to: :object

  def birthday_employees
    Clients::BamboohrClient.find_employees.find_birthday_employees
  end

  def anniversary_employees
    Clients::BamboohrClient.find_employees.find_anniversary_employees
  end

  def time_off_employees
    Clients::BamboohrClient.find_employees.find_time_off_employees
  end
end
