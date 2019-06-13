class CreateSolarcycles < ActiveRecord::Migration[5.2]
  def change
    create_table :solarcycles do |t|
      t.string :type, null: false
      t.string :time, null: false
      t.references :location
      t.timestamps
    end
  end
end
