class TaskSerializer < ApplicationSerializer
  attributes :id, :name, :description, :state, :expired_at
  belongs_to :author
  belongs_to :assignee

  attribute :transitions do
    object.state_transitions.map do |transition|
      {
        event: transition.event,
        from: transition.from,
        to: transition.to,
      }
    end
  end

  attribute :image_url do
    object.image.attached? ? AttachmentsService.file_url(object.image) : nil
  end
end
