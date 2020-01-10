class Types::WidgetCollectionType < Types::BaseObject
  field :enabled, [Types::WidgetType]
  field :next, Types::WidgetType do
    argument :current_widget_id, Integer, required: false
  end

  def enabled
    object.enabled.available.all
  end

  def next(current_widget_id: nil)
    object.enabled.next_or_default(current_widget_id)
  end
end
