class Events::EventController < ApplicationController
  protect_from_forgery with: :null_session

  def create
    event = Event.new(event_params)
    if event.save
      render json: { message: 'Event created' }, status: :created
    else
      render json: { message: event.errors.full_messages }, status: :bad_request
    end
  rescue StandardError => e
    render json: { message: e.message }, status: :bad_request
  end

  private

  def event_params
    params.require(:event).permit(:source, :external_id)
  end
end
