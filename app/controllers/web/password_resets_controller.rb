class Web::PasswordResetsController < Web::ApplicationController
  before_action :validate_token, only: [:edit, :update]

  def new
    @password_reset = PasswordResetForm.new
  end

  def create
    user = User.find_by(password_reset_params)

    SendPasswordResetMailJob.perform_async(user.id) if user.present?

    redirect_to(:new_session)
  end

  def edit
    @password_setting = PasswordSettingForm.new
  end

  def update
    @password_setting = PasswordSettingForm.new(password_params)

    if @password_setting.valid?
      PasswordResettingService.set_password(@user, @password_setting.password)
      redirect_to(:new_session, notice: 'Password has been reset')
    else
      render(:edit)
    end
  end

  private

  def validate_token
    @user = PasswordResettingService.find_user_by_token(params[:id])
    redirect_to(:new_session, alert: 'Password reset has expired') unless @user
  end

  def password_reset_params
    params.require(:password_reset_form).permit(:email)
  end

  def password_params
    params.require(:password_setting_form).permit(:password, :password_confirmation)
  end
end
