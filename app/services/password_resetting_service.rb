module PasswordResettingService
  class << self
    DEFAULT_EXPIRES_IN = 24.hours

    def token(user, options = {})
      expires_in = options['expires_in'] || DEFAULT_EXPIRES_IN
      token_id = SecureRandom.base58
      reset_data = [user.id, token_id]

      if user.update({ valid_reset_token_id: token_id })
        User.signed_id_verifier.generate(reset_data, expires_in: expires_in, purpose: :password_reset)
      end
    end

    def find_user_by_token(token)
      reset_data = User.signed_id_verifier.verified(token, purpose: :password_reset)
      return nil if reset_data.nil?

      user_id, token_id = reset_data
      user = User.find(user_id)

      user&.valid_reset_token_id.nil? || token_id != user.valid_reset_token_id ? nil : user
    end

    def set_password(user, password_params)
      user.update(password_params.merge({ valid_reset_token_id: nil }))
    end
  end
end
