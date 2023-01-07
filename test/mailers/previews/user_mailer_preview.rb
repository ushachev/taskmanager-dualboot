# Preview all emails at http://localhost:3000/rails/mailers/user_mailer
class UserMailerPreview < ActionMailer::Preview
  def task_created
    user = User.first
    task = Task.first
    params = { user: user, task: task }

    UserMailer.with(params).task_created
  end

  def task_updated
    task = Task.first
    params = { task: task }

    UserMailer.with(params).task_updated
  end

  def task_deleted
    task = Task.first
    params = { task: task }

    UserMailer.with(params).task_deleted
  end

  def password_reset
    user = User.first
    params = { user: user }

    UserMailer.with(params).password_reset
  end
end
