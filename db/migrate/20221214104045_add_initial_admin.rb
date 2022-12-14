class AddInitialAdmin < ActiveRecord::Migration[6.1]
  def up
    if ENV['INITIAL_ADMIN_EMAIL'].present?
      user = User.
        create_with(first_name: 'admin', last_name: 'admin').
        find_or_create_by(email: ENV['INITIAL_ADMIN_EMAIL'])
      user.password = ENV['INITIAL_ADMIN_PASSWORD'] || user.password
      user.type = 'Admin'
      user.save
    end
  end

  def down
    user = User.find_by(email: ENV['INITIAL_ADMIN_EMAIL'])
    user.update(type: 'Developer') if user.present?
  end
end
