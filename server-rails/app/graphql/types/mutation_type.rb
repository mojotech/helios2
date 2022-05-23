class Types::MutationType < Types::BaseObject
  field :testField, String

  def test_field
    "Hello World!"
  end
end
