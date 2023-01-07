class AddResetMarkToUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :reset_mark, :string
  end
end
