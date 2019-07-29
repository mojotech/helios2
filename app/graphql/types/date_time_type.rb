class Types::DateTimeType < GraphQL::Schema::Scalar
  def self.coerce_input(value, _context)
    Time.zone.parse(value)
  end

  def self.coerce_result(value, _context)
    value.utc.iso8601
  end
end
