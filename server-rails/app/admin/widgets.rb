ActiveAdmin.register Widget do
  permit_params :name, :enabled, :duration_seconds, :position, :location_id, :start, :stop, :sidebar_text, :show_weather
end
