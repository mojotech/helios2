class CreateEmployeeEvents < ActiveRecord::Migration[5.2]
  def change
    create_table :employee_events do |t|
      t.string :external_id
      t.text :display_name
      t.string :birthday
      t.string :hire_date
      t.boolean :is_photo_uploaded
      t.string :photo_url
      t.text :time_off_employees, default: [].to_yaml

      t.timestamps
    end
  end
end
