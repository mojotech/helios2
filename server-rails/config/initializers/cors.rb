if Rails.env.development?
  Rails.application.config.middleware.insert_before 0, Rack::Cors do
    allow do
      origins 'http://localhost:5000'
      resource '*', headers: :any, methods: [:get, :post, :options], credentials: true
    end
  end
end
