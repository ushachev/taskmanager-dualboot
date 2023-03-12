class AddValidResetTokenMarkToUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :valid_reset_token_mark, :string
  end
end
