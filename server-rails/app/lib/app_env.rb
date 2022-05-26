class AppEnv
  def self.[](key)
    ENV.key?(key) && ENV[key].strip
  end
end
