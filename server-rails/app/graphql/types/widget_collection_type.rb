class Types::WidgetCollectionType < Types::BaseObject
  field :enabled, [Types::WidgetType]
  field :next, Types::WidgetType do
    argument :current_widget_id, Integer, required: false
  end
  field :by_id_or_first, Types::WidgetType do
    argument :id, Integer, required: false
  end

  def enabled
    enabled_and_available.all
  end

  def next(current_widget_id: nil)
    enabled_and_available.next_or_default(current_widget_id)
  end

  def by_id_or_first(id: nil)
    scope = enabled_and_available
    id && scope.find_by(id: id) || scope.first
  end

  def enabled_and_available
    location = object.proxy_association.owner
    object
      .enabled
      .available(location.time_now)
  end
end
