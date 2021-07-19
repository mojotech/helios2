class Clients::CreateEmployees
  def initialize(employees, time_off)
    @employees = employees
    @time_off = time_off
    @dates = create_dates
  end

  def add_employee(employee)
    EmployeeEvents.create!(external_id: employee['id'], display_name: employee['displayName'],
                           birthday: employee['birthday'], hire_date: employee['hireDate'],
                           is_photo_uploaded: employee['isPhotoUploaded'], photo_url: employee['photoUrl'],
                           time_off_employees: find_time_off_employees)
  end

  def update_employees
    @employees.each do |e|
      if EmployeeEvents.exists?(external_id: e['id'])
        EmployeeEvents.update(e['id'], display_name: e['displayName'],
                                       birthday: e['birthday'], hire_date: e['hireDate'],
                                       is_photo_uploaded: e['isPhotoUploaded'], photo_url: e['photoUrl'],
                                       time_off_employees: find_time_off_employees)
      else
        add_employee(e)
      end
    end
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
