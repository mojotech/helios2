class AddStartStopToWidgets < ActiveRecord::Migration[5.2]
  def change
    add_column :widgets, :start, :string
    add_column :widgets, :stop, :string
  end
end
