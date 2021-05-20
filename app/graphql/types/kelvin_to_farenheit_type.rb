class Types::KelvinToFarenheitType < GraphQL::Schema::Scalar
  def self.coerce_result(value, _ctx)
    ((value.to_f - 273.15) * 1.8 + 32.0).truncate(2)
  end
end
