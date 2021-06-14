class Clients::CreateEmployees
  def initialize(employees, time_off)
    @employees = employees
    @time_off = time_off
    @dates = create_dates
  end

  def create_dates
    (-2..2).map { |n| (Time.zone.today + n).to_formatted_s(:iso8601) }
  end

  def date_contains(date)
    @dates.any? { |d|
      d.include? date
    }
  end

  def find_birthday_employees
    @employees.select { |employee|
      employee['birthday'].present? &&
        date_contains(employee['birthday'])
    }
  end

  def find_anniversary_employees
    @employees.select { |employee|
      employee['hireDate'].present? &&
        date_contains(employee['hireDate'][5..9])
    }
  end

  def find_time_off_employees
    @employees.select { |employee|
      @time_off.any? { |e|
        e['employeeId'].to_s.include? employee['id']
      }
    }
  end
end
