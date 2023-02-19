class PasswordForm
  include ActiveModel::Model

  attr_accessor(
    :password,
    :password_confirmation,
  )

  validates :password, confirmation: true
  validate :password_valid?

  def persisted?
    true
  end

  private

  def password_valid?
    errors.add(:password, :blank) if password.blank?
  end
end
