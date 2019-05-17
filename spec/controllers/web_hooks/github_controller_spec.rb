require 'rails_helper'

RSpec.describe WebHooks::GithubController, type: :controller do
  WebHooks::GithubController.skip_before_action :authenticate_github_request!
  describe "publish" do
    it "does nothing for existing records" do
      Event.create!(source: 'github_pull', external_id: '1234')
      scope = Event.pull_requests.with_external_id('1234')
      expect { @controller.send(:publish, scope) }.to change { Event.count }.by(0)
    end

    it "persists and triggers subscriptions for new records" do
      scope = Event.pull_requests.with_external_id('5678')
      expect { @controller.send(:publish, scope) }.to change { Event.count }.by(1)
    end
  end
end

RSpec.describe 'github webhook requests', type: :request do
  describe "POST :status" do
    headers = {
      'X-Github-Event': 'status',
      'Content-Type': 'application/json'
    }

    it "completes successfully" do
      post '/web_hooks/github', params: {}, headers: headers
      expect(response.status).to equal(200)
    end
  end

  describe "POST :pull_request" do
    count = Event.pull_requests.count
    params = Simulate.pull_request.render(number: count + 1, id: count + 1).to_s

    headers = {
      'X-Github-Event': 'pull_request',
      'Content-Type': 'application/json'
    }

    it "completes successfully" do
      post '/web_hooks/github', params: params, headers: headers
      expect(response.status).to equal(200)
    end

    it "creates new events records" do
      expect do
        post '/web_hooks/github', params: params, headers: headers
      end.to change { Event.pull_requests.count }.by(1)
    end
  end

  describe "POST :push" do
    params = Simulate.push.render(hashes: [SecureRandom.uuid.split('-').join]).to_s
    headers = {
      'X-Github-Event': 'push',
      'Content-Type': 'application/json'
    }

    it "completes successfully" do
      post '/web_hooks/github', params: params, headers: headers
      expect(response.status).to equal(200)
    end

    it "creates new event records" do
      expect do
        post '/web_hooks/github', params: params, headers: headers
      end.to change { Event.commits.count }.by(1)
    end
  end
end
