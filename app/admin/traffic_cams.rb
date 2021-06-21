ActiveAdmin.register TrafficCam do
  permit_params :title, :url, :location_id, :feed_format
end
