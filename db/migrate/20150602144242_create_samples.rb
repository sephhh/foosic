class CreateSamples < ActiveRecord::Migration
  def change
    create_table :samples do |t|
      t.string :name
      t.string :url

      t.timestamps null: false
    end
    # commented due to issues with postgres
    # add_foreign_key :samples, :boards
  end
end
