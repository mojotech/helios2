class Simulate
  def initialize(template_path)
    @template_path = template_path
  end

  def render(assigns)
    av = ActionView::Base.new(Rails.root.join('app', 'lib', 'simulate'))
    av.assign(assigns)
    av.render(template: @template_path)
  end

  def self.pull_request
    Simulate.new('pull-request-open.json.erb')
  end

  def self.push
    Simulate.new('push-master.json.erb')
  end
end
