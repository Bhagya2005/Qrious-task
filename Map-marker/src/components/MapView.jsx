import React from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const getColoredIcon = (color) =>
  L.divIcon({
    className: "",
    html: `
      <svg width="35" height="35" viewBox="0 0 24 24" style="transform: translate(-5px, -5px)">
        <path fill="${color}" d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5c-1.4 0-2.5-1.1-2.5-2.5S10.6 6.5 12 6.5s2.5 1.1 2.5 2.5S13.4 11.5 12 11.5z"/>
      </svg>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 30]
  });

function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });
  return null;
}

function MapMouseMoveHandler({ onMouseMove }) {
  useMapEvents({
    mousemove(e) {
      onMouseMove(e.latlng);
    },
  });
  return null;
}
function MapInstanceSaver() {
  const map = useMapEvents({});
  window.map = map;    
  return null;
}


export default function MapView({ pins, onMapClick, onMouseMove, setSelectedPin }) {
  return (
    <div className="map-container">      
      <MapContainer center={[20.5937, 78.9629]} zoom={5} className="map">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapClickHandler onMapClick={onMapClick} />
        <MapMouseMoveHandler onMouseMove={onMouseMove} />
        <MapInstanceSaver />

      {pins.map((pin) => (
          <Marker
            key={pin.id}
            position={[pin.lat, pin.lng]}
            icon={getColoredIcon(pin.color)}
            eventHandlers={{
            click: (e) => {
            setSelectedPin(pin);
            const map = e.target._map;
            map.flyTo([pin.lat, pin.lng], 8, {     
              animate: true,
              duration: 1.5});
              },
          }}
                  >
            <Popup>
              <h4>{pin.name}</h4>
              <p>{pin.desc}</p>
              <p>Category: {pin.category}</p>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}





