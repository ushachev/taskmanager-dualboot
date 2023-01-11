class SendTaskDeleteNotificationJob < ApplicationJob
  sidekiq_options queue: :mailers
  sidekiq_throttle_as :mailer

  def perform(task_attributes)
    task_author = User.find_by(id: task_attributes['author_id'])
    return if task_author.blank?

    UserMailer.with(user: task_author, task: task_attributes).task_deleted.deliver_now
  end
end
