class User < ApplicationRecord
  has_secure_password

  has_many :my_tasks, class_name: 'Task', foreign_key: :author_id
  has_many :assigned_tasks, class_name: 'Task', foreign_key: :assignee_id

  validates :first_name, :last_name, :email, presence: true
  validates :first_name, :last_name, length: { minimum: 2 }
  validates :email, format: { with: /\A\S+@.+\.\S+\z/ }
  validates :email, uniqueness: true

  def reset_token(expires_in: 24.hours)
    update({ reset_mark: SecureRandom.base58 })
    reset_data = [id, reset_mark]
    User.signed_id_verifier.generate(reset_data, expires_in: expires_in, purpose: :password_reset)
  end

  def self.find_by_reset_token(token)
    reset_data = User.signed_id_verifier.verified(token, purpose: :password_reset)
    return nil if reset_data.nil?

    user_id, user_reset_mark = reset_data
    user = find(user_id)

    user&.reset_mark.nil? || user_reset_mark != user.reset_mark ? nil : user
  end
end
