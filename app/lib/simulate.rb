class Simulate
  def initialize(template_path)
    @template_path = template_path
  end

  def render(assigns)
    ApplicationController.render(
      inline: File.read(Rails.root.join('app/lib/simulate', @template_path)),
      assigns: assigns
    )
  end

  def self.pull_request
    Simulate.new('pull-request-open.json.erb')
  end

  def self.push
    Simulate.new('push-master.json.erb')
  end

  def self.slack_message
    Simulate.new('slack-message.json.erb')
  end

  def self.slack_announcement
    Simulate.new('slack-announcement.json.erb')
  end
end
