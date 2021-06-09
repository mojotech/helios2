class PagesController < ApplicationController
  def index
    if !params[:city_name]
      redirect_to "/#{ENV['PRIMARY_CITY_NAME']}"
    elsif Location.where(city_name: params[:city_name]).empty?
      raise RoutingError, 'Not Found'
    end
  end
end
