class PasswordSettingForm
  include ActiveModel::Model

  attr_accessor(
    :password,
    :password_confirmation,
  )

  validates :password, presence: true, confirmation: true

  def persisted?
    true
  end
end
