if ENV['COVERAGE']
  require 'simplecov'

  SimpleCov.start('rails') do
    if ENV['CI']
      require 'simplecov-lcov'

      SimpleCov::Formatter::LcovFormatter.config do |c|
        c.report_with_single_file = true
        c.single_report_path = 'coverage/lcov.info'
      end

      formatter SimpleCov::Formatter::LcovFormatter
    end

    add_filter ['version.rb', 'initializer.rb']
  end
end

ENV['RAILS_ENV'] ||= 'test'
require_relative '../config/environment'
require 'bullet_helper'
require 'rails/test_help'
require 'sidekiq/testing'

class ActiveSupport::TestCase
  include FactoryBot::Syntax::Methods
  include AuthHelper
  include ActionMailer::TestHelper
  include BulletHelper

  # Run tests in parallel with specified workers
  parallelize(workers: :number_of_processors)

  if ENV['COVERAGE']
    parallelize_setup do |worker|
      SimpleCov.command_name("#{SimpleCov.command_name}-#{worker}")
    end

    parallelize_teardown do |_worker|
      SimpleCov.result
    end
  end

  # Setup all fixtures in test/fixtures/*.yml for all tests in alphabetical order.
  fixtures :all

  # Add more helper methods to be used by all tests here...
  Sidekiq::Testing.inline!
end
