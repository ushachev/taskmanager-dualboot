module BulletHelper
  def after_setup
    Bullet.start_request
    super if defined?(super)
  end

  def before_teardown
    super if defined?(super)

    Bullet.perform_out_of_channel_notifications if Bullet.notification?
    Bullet.end_request
  end
end
