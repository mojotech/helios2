require 'rails_helper'
require 'bamboozled'

EMPLOYEESDATA = [
  { "id" => "4", "displayName" => "Charlotte Abbott", "hireDate" => "2019-07-22",
    "birthday" => "07-29", "isPhotoUploaded" => "true",
    :photoUrl => "http://blahbambooapitestblah.bamboohr.com/employees/photos/?h=e27ddc876e2b95ca0ac80ad62967506a" },
  { "id" => "5", "displayName" => "Ashley Adams", "hireDate" => "2020-12-18",
    "birthday" => "05-25", "isPhotoUploaded" => "true",
    :photoUrl => "http://blahbambooapitestblah.bamboohr.com/employees/photos/?h=efbf026fde3168eb96a3447b040f5f91" },
  { "id" => "6", "displayName" => "Christina Agluinda", "hireDate" => "2020-08-13",
    "birthday" => "7-22", "isPhotoUploaded" => "true",
    :photoUrl => "http://blahbambooapitestblah.bamboohr.com/employees/photos/?h=206a1f7e6807f2dac63a7611dfce8453" }
].freeze

TIMEOFFDATA = [
  { "id" => 1501, "type" => "timeOff", "employeeId" => 5, "name" => "Ashley Adams",
    "start" => "2021-07-22", "end" => "2021-07-22" }
].freeze

DATESDATA = ["2021-07-22"].freeze

describe Clients::CreateEmployees do
  let(:context) { {} }
  let(:variables) { {} }

  context 'from bambooHR Client' do
    it 'find_anniversary_employees will find the correct employee' do
      anniversary_result = Clients::CreateEmployees.new(EMPLOYEESDATA, TIMEOFFDATA,
                                                        DATESDATA).find_anniversary_employees
      expect(anniversary_result.first["id"]).to eq("4")
      expect(anniversary_result.first["displayName"]).to eq("Charlotte Abbott")
      expect(anniversary_result.first["hireDate"]).to eq("2019-07-22")
      expect(anniversary_result.first["birthday"]).to eq("07-29")
      expect(anniversary_result.first["isPhotoUploaded"]).to eq("true")
      expect(anniversary_result.first[:photoUrl]).to eq(
        "http://blahbambooapitestblah.bamboohr.com/employees/photos/?h=e27ddc876e2b95ca0ac80ad62967506a"
      )
    end
    it 'find_time_off_employees will find the correct employee' do
      time_off_result = Clients::CreateEmployees.new(EMPLOYEESDATA, TIMEOFFDATA, DATESDATA).find_time_off_employees
      expect(time_off_result.first["id"]).to eq("5")
      expect(time_off_result.first["displayName"]).to eq("Ashley Adams")
      expect(time_off_result.first["hireDate"]).to eq("2020-12-18")
      expect(time_off_result.first["birthday"]).to eq("05-25")
      expect(time_off_result.first["isPhotoUploaded"]).to eq("true")
      expect(time_off_result.first[:photoUrl]).to eq(
        "http://blahbambooapitestblah.bamboohr.com/employees/photos/?h=efbf026fde3168eb96a3447b040f5f91"
      )
    end
    it 'find_birthday_employees will find the correct employee' do
      birthday_result = Clients::CreateEmployees.new(EMPLOYEESDATA, TIMEOFFDATA, DATESDATA).find_birthday_employees
      expect(birthday_result.first["id"]).to eq("6")
      expect(birthday_result.first["displayName"]).to eq("Christina Agluinda")
      expect(birthday_result.first["hireDate"]).to eq("2020-08-13")
      expect(birthday_result.first["birthday"]).to eq("7-22")
      expect(birthday_result.first["isPhotoUploaded"]).to eq("true")
      expect(birthday_result.first[:photoUrl]).to eq(
        "http://blahbambooapitestblah.bamboohr.com/employees/photos/?h=206a1f7e6807f2dac63a7611dfce8453"
      )
    end
  end
end
