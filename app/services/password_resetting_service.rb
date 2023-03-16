module PasswordResettingService
  class << self
    DEFAULT_EXPIRES_IN = 24.hours

    def token(user, options = {})
      expires_in = options['expires_in'] || DEFAULT_EXPIRES_IN
      token_mark = SecureRandom.base58
      reset_data = [user.id, token_mark]

      if user.update({ valid_reset_token_mark: token_mark })
        User.signed_id_verifier.generate(reset_data, expires_in: expires_in, purpose: :password_reset)
      end
    end

    def find_user_by_token(token)
      reset_data = User.signed_id_verifier.verified(token, purpose: :password_reset)
      return nil if reset_data.nil?

      user_id, token_mark = reset_data
      user = User.find(user_id)

      user&.valid_reset_token_mark.nil? || token_mark != user.valid_reset_token_mark ? nil : user
    end

    def set_password(user, password)
      user.update({
                    password: password,
                    valid_reset_token_mark: nil,
                  })
    end
  end
end
