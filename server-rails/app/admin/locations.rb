ActiveAdmin.register Location do
  permit_params :latitude, :longitude, :city_name, :time_zone, :wifi_name, :wifi_password, :bathroom_code
end
