class CreateSamples < ActiveRecord::Migration
  def change
    create_table :samples do |t|
      t.string :name
      t.string :url
      t.belongs_to :board, index: true

      t.timestamps null: false
    end
    add_foreign_key :samples, :boards
  end
end
