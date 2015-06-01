class CreatePads < ActiveRecord::Migration
  def change
    create_table :pads do |t|
      t.string :sample
      t.belongs_to :board, index: true

      t.timestamps null: false
    end
    add_foreign_key :pads, :boards
  end
end
