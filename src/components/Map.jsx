import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker, Polyline } from '@react-google-maps/api';
import axios from 'axios';

const containerStyle = {
  width: '100%',
  height: '100vh'
};

const Map = () => {
  const [vehicleLocation, setVehicleLocation] = useState({ lat: 37.7749, lng: -122.4194 });
  const [path, setPath] = useState([]);

  useEffect(() => {
    const fetchVehicleLocation = async () => {
      try {
        const response = await axios.get('http://localhost:3000/location');
        const { latitude, longitude } = response.data;
        setVehicleLocation({ lat: latitude, lng: longitude });

        setPath((prevPath) => [...prevPath, { lat: latitude, lng: longitude }]);
      } catch (error) {
        console.error('Error fetching location:', error);
      }
    };

    fetchVehicleLocation(); // Fetch initial location
    const interval = setInterval(fetchVehicleLocation, 5000); // Update every 5 seconds

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={vehicleLocation}
        zoom={12}
      >
        <Marker position={vehicleLocation} />
        <Polyline path={path} options={{ strokeColor: '#FF0000', strokeOpacity: 0.8, strokeWeight: 2 }} />
      </GoogleMap>
    </LoadScript>
  );
};

export default Map;
