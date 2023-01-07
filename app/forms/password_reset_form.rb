class PasswordResetForm
  include ActiveModel::Model

  attr_accessor(:email)

  validates :email, presence: true, format: { with: /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i }
end
