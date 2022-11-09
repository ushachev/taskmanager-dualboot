class Task < ApplicationRecord
  belongs_to :author, class_name: 'User'
  belongs_to :assignee, class_name: 'User', optional: true

  validates :name, :description, :author, presence: true
  validates :description, length: { maximum: 500 }

  state_machine initial: :new_task do
    event :develop do
      transition [:new_task, :in_qa, :in_code_review] => :in_development
    end

    event :check do
      transition in_development: :in_qa
    end

    event :review do
      transition in_qa: :in_code_review
    end

    event :approve do
      transition in_code_review: :ready_for_release
    end

    event :release do
      transition ready_for_release: :released
    end

    event :archive do
      transition [:new_task, :released] => :archived
    end
  end
end
