class EmployeeEvents < ApplicationRecord
  serialize :birthday_employees, Array
  serialize :anniversary_employees, Array
  serialize :time_off_employees, Array
end
