class AddSidebarTextAndShowWeatherToWidgets < ActiveRecord::Migration[5.2]
  def change
    add_column :widgets, :sidebar_text, :string
    add_column :widgets, :show_weather, :boolean
  end
end
