class UserMailer < ApplicationMailer
  default from: 'noreply@taskmanager.com'

  def task_created
    user = params[:user]
    @task = params[:task]

    mail(to: user.email, subject: 'New Task Created')
  end

  def task_updated
    @task = params[:task]

    mail(to: @task.author.email, subject: 'Task Updated')
  end

  def task_deleted
    @task = params[:task]

    mail(to: @task.author.email, subject: 'Task Deleted')
  end

  def password_reset
    user = params[:user]
    @token = PasswordResettingService.token(user)

    mail(to: user.email, subject: 'Reset Password')
  end
end
