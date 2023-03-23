class Mail::SendPasswordResetLinkJob < Mail::ApplicationJob
  def perform(user_id)
    user = User.find_by(id: user_id)
    return if user.blank?

    UserMailer.with(user: user).password_reset.deliver_now
  end
end
