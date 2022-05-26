class AddLocationIdFkToWidgets < ActiveRecord::Migration[5.2]
  def change
    add_reference :widgets, :location, index: true
  end
end
