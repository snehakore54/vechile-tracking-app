// src/components/VehicleTracker.jsx
import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import { FaCar } from 'react-icons/fa'; // Import car icon
import './VehicleTracker.css'; // Import custom CSS

const VehicleTracker = () => {
  const mapRef = useRef(null);
  const [address, setAddress] = useState('');
  const [map, setMap] = useState(null);

  useEffect(() => {
    // Initialize the map
    const mapInstance = L.map(mapRef.current).setView([17.385044, 78.486671], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapInstance);

    // Convert React Icon to SVG and use as marker
    const carIcon = L.divIcon({
      className: 'custom-car-icon',
      html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-car"><path d="M5 16h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2z"></path><circle cx="7" cy="17" r="2"></circle><circle cx="17" cy="17" r="2"></circle></svg>`,
      iconSize: [32, 32],
    });

    const marker = L.marker([17.385044, 78.486671], { icon: carIcon }).addTo(mapInstance);

    setMap(mapInstance);

    // Function to fetch vehicle location
    const fetchVehicleLocation = async () => {
      try {
        const response = await axios.get('http://localhost:3000/location');
        const { latitude, longitude } = response.data;
        const newLatLng = L.latLng(latitude, longitude);

        // Update vehicle marker position
        marker.setLatLng(newLatLng);

        // Center map on the vehicle's position
        mapInstance.panTo(newLatLng);

        // Fetch the address from the coordinates
        const addressResponse = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json`, {
          params: {
            access_token: 'YOUR_MAPBOX_ACCESS_TOKEN',
            limit: 1
          }
        });
        const address = addressResponse.data.features[0]?.place_name || 'Address not found';
        setAddress(address);
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
    <div className="vehicle-tracker">
      <div id="map" className="map" ref={mapRef}></div>
      <div className="address-display">
        <strong>Current Address:</strong>
        <p>{address}</p>
      </div>
    </div>
  );
};

export default VehicleTracker;
