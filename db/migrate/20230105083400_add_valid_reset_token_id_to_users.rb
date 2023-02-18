class AddValidResetTokenIdToUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :valid_reset_token_id, :string
  end
end
