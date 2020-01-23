class Types::WidgetCollectionType < Types::BaseObject
  field :enabled, [Types::WidgetType]
  field :next, Types::WidgetType do
    argument :current_widget_id, Integer, required: false
  end
  field :by_id_or_first, Types::WidgetType do
    argument :id, Integer, required: false
  end

  def enabled
    object.enabled.available.order(:position).all
  end

  def next(current_widget_id: nil)
    object.enabled.available.next_or_default(current_widget_id)
  end

  def by_id_or_first(id: nil)
    scope = object.enabled.available.order(:position)
    id && scope.find_by(id: id) || scope.first
  end
end
