class Types::BaseField < GraphQL::Schema::Field
  def initialize(*args, **kwargs, &block)
    kwargs.reverse_merge! null: false
    super(*args, **kwargs, &block)
  end
end
