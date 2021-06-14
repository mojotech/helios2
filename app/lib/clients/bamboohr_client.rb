class Clients::BamboohrClient
  def self.find_employees
    Clients::CreateEmployees.new(create_employees, create_time_off)
  end

  def self.create_client
    Bamboozled.client(subdomain: AppEnv['BAMBOOHR_SUBDOMAIN'], api_key: AppEnv['BAMBOOHR_API_KEY'])
  end

  def self.create_employees
    create_client.employee.all(:all).map { |employee|
      employee[:photoUrl] = create_client.employee.photo_url(employee['id'].to_i)
      employee
    }
  end

  def self.create_time_off
    create_client.time_off.whos_out(Time.zone.now, Time.zone.now)
  end
end
