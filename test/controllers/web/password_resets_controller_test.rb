require 'test_helper'

class Web::PasswordResetsControllerTest < ActionController::TestCase
  test 'should get new' do
    get :new
    assert_response :success
  end

  test 'should post create' do
    user = create(:user)

    assert_emails 1 do
      post :create, params: { password_reset_form: { email: user.email } }
    end
    assert_response :redirect
  end

  test 'should post create w/o email' do
    fake_email = generate(:email)

    assert_emails 0 do
      post :create, params: { password_reset_form: { email: fake_email } }
    end
    assert_response :redirect
  end

  test 'should get edit' do
    user = create(:user)
    get :edit, params: { id: PasswordResettingService.token(user) }
    assert_response :success
  end

  test 'should not get edit' do
    user = create(:user)
    reset_token = PasswordResettingService.token(user)
    travel 24.hours + 1.minute
    get :edit, params: { id: reset_token }

    assert_equal 'Password reset has expired', flash[:alert]
    assert_response :redirect
  end

  test 'should not get edit 2' do
    user = create(:user)
    reset_token = PasswordResettingService.token(user)
    _next_reset_token = PasswordResettingService.token(user)
    get :edit, params: { id: reset_token }

    assert_equal 'Password reset has expired', flash[:alert]
    assert_response :redirect
  end

  test 'should patch update' do
    user = create(:user)
    reset_token = PasswordResettingService.token(user)
    password = generate(:string)
    password_attrs = {
      password: password,
      password_confirmation: password,
    }
    patch :update, params: { id: reset_token, password_setting: password_attrs }

    assert_equal 'Password has been reset', flash[:notice]
    assert_response :redirect

    patch :update, params: { id: reset_token, user: password_attrs }

    assert_equal 'Password reset has expired', flash[:alert]
    assert_response :redirect
  end
end
