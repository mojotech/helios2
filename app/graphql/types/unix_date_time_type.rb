
class Types::UnixDateTimeType < GraphQL::Schema::Scalar
  def self.coerce_result(value, _ctx)
    Time.at(value).iso8601
  end
end
