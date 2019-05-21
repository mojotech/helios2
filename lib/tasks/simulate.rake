namespace :simulate do
  desc "Simulates opening a new pull request on github"
  task pull_request: :environment do
    post_github_event('pull_request', render_new_pull_request_json)
  end

  desc "Simulates a new commit on github"
  task :commit, [:count] => :environment do |_t, args|
    args.with_defaults(count: 1)
    post_github_event('push', render_new_push_json(args[:count].to_i))
  end

  desc "Simulates a new message on Slack"
  task slack_message: :environment do
    post_slack_event(render_new_slack_message_json)
  end

  desc "Simulates a new announcement on Slack"
  task slack_announcement: :environment do
    post_slack_event(render_new_slack_announcement_json)
  end

  def disable_github_authentication
    WebHooks::GithubController.skip_before_action :authenticate_github_request!
  end

  def post_github_event(event, params)
    disable_github_authentication
    session = ActionDispatch::Integration::Session.new(Rails.application)
    resp = session.post(
      "/web_hooks/github",
      params: params,
      headers: {
        'X-GitHub-Event': event,
        'Content-Type': 'application/json'
      }
    )
    puts "Response: #{resp}"
  end

  def post_slack_event(params)
    ENV['SLACK_VERIFICATION_TOKEN'] = 'Sim-123456'
    session = ActionDispatch::Integration::Session.new(Rails.application)
    resp = session.post(
      "/web_hooks/slack_event",
      params: params,
      headers: { 'Content-Type': 'application/json' }
    )
    puts "Slack event response: #{resp}"
  end

  def render_new_pull_request_json
    count = Event.pull_requests.count
    Simulate.pull_request.render(number: count + 1, id: count + 1)
  end

  def render_new_push_json(commit_count = 3)
    hashes = Array.new(commit_count) { SecureRandom.uuid.split('-').join }
    Simulate.push.render(hashes: hashes)
  end

  def render_new_slack_message_json
    Simulate.slack_message.render(event_id: "Sim-#{generate_hash}")
  end

  def render_new_slack_announcement_json
    Simulate.slack_announcement.render(event_id: "Sim-#{generate_hash}")
  end

  def generate_hash
    SecureRandom.uuid
  end
end
