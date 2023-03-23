class Mail::ApplicationJob < ApplicationJob
  sidekiq_options queue: :mailers,
                  lock: :until_and_while_executing,
                  on_conflict: { client: :log, server: :reject }
  sidekiq_throttle_as :mailer
end
