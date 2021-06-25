class AppEnv
  def self.[](key)
    raise "env #{key} is missing" unless ENV.key?(key)
    ENV.key?(key) && ENV[key].strip
  end
end
