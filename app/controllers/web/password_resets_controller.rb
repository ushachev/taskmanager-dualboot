class Web::PasswordResetsController < Web::ApplicationController
  before_action :validate_token, only: [:edit, :update]

  def new
    @password_reset = PasswordResetForm.new
  end

  def create
    user = User.find_by(password_reset_params)

    if user
      UserMailer.with({ user: user }).password_reset.deliver_now
    end

    redirect_to(:new_session)
  end

  def edit; end

  def update
    if user_params[:password].blank?
      @user.errors.add(:password, :blank)
      render(:edit)
    elsif @user.update(user_params.merge({ reset_mark: nil }))
      redirect_to(:new_session, notice: 'Password has been reset')
    else
      render(:edit)
    end
  end

  private

  def validate_token
    @user = User.find_by_reset_token(params[:id])
    redirect_to(:new_session, alert: 'Password reset has expired') unless @user
  end

  def password_reset_params
    params.require(:password_reset_form).permit(:email)
  end

  def user_params
    params.require(:user).permit(:password, :password_confirmation)
  end
end
