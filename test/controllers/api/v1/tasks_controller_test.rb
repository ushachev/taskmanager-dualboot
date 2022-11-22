require 'test_helper'

class Api::V1::TasksControllerTest < ActionController::TestCase
  test 'should get index' do
    get :index, params: { format: :json }
    assert_response :success
  end

  test 'should get show' do
    author = create(:user)
    task = create(:task, author: author)
    get :show, params: { id: task.id, format: :json }
    assert_response :success
  end

  test 'should post create' do
    author = create(:user)
    sign_in(author)
    assignee = create(:user)
    task_attributes = attributes_for(:task).merge({ assignee_id: assignee.id })
    post :create, params: { task: task_attributes, format: :json }
    assert_response :created

    data = JSON.parse(response.body)
    created_task = Task.find(data['task']['id'])

    assert created_task.present?
    assert_equal task_attributes.merge({ state: 'new_task' }).stringify_keys,
                 created_task.slice(*task_attributes.keys)
  end
end
