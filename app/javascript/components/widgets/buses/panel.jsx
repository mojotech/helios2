import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import mapboxgl from '!mapbox-gl';
import PropTypes from 'prop-types';
import MapStyle from './globalMapStyle';
import vehiclepositions from './vehiclepositions.json';

mapboxgl.accessToken = process.env.MAPBOX_TOKEN;

const MapDimensions = styled.div`
  width: 1000px;
  height: 750px;
`;

const Marker = ({ feature, map }) => {
  const markerref = useRef(null);

  useEffect(() => {
    const marker = new mapboxgl.Marker(markerref)
      .setLngLat([
        feature.vehicle.position.longitude,
        feature.vehicle.position.latitude,
      ])

      .addTo(map);
    return () => marker.remove();
  });

  return <div ref={markerref} className="marker" />;
};

const MapWithMarkers = ({ map, features }) => {
  return (
    <>
      {features &&
        map &&
        features.map(feature => {
          return <Marker feature={feature} map={map} />;
        })}
    </>
  );
};

const Buses = () => {
  const mapContainer = useRef(null);
  const [mapState, setMap] = useState(null);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-71.4125, 41.8255],
      zoom: 17,
    });

    map.addControl(new mapboxgl.NavigationControl(), 'top-left');
    setMap(map);
    return () => map.remove();
  }, []);

  return (
    <div>
      <MapStyle />
      <div className="sidebar">
      </div>
      <MapDimensions ref={mapContainer} className="map-container">
        <MapWithMarkers
          map={mapState}
          features={vehiclepositions.entity}
        />
      </MapDimensions>
    </div>
  );
};

Marker.propTypes = {
  feature: PropTypes.object.isRequired,
  map: PropTypes.object.isRequired,
};

MapWithMarkers.propTypes = {
  map: PropTypes.object,
  features: PropTypes.array,
};

export default Buses;
