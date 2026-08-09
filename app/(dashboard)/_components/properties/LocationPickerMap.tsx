"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap, LayersControl } from "react-leaflet";
import L from "leaflet";
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import "leaflet/dist/leaflet.css";
import "leaflet-geosearch/dist/geosearch.css";
import { Crosshair } from "lucide-react";

// Fix for default Leaflet marker icons in Next.js
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

interface LocationPickerMapProps {
  initialLat?: number;
  initialLng?: number;
  onLocationChange: (lat: number, lng: number) => void;
}

function SearchField({ setPosition, onLocationChange }: any) {
  const map = useMap();
  useEffect(() => {
    const provider = new OpenStreetMapProvider();
    const searchControl = new (GeoSearchControl as any)({
      provider: provider,
      style: 'bar',
      showMarker: false,
      showPopup: false,
      autoClose: true,
      retainZoomLevel: false,
      animateZoom: true,
      keepResult: true,
      searchLabel: 'Enter address, building, or area',
    });
    map.addControl(searchControl);
    
    const handleLocationFound = (result: any) => {
      const latlng = L.latLng(result.location.y, result.location.x);
      setPosition(latlng);
      onLocationChange(latlng.lat, latlng.lng);
    };

    map.on('geosearch/showlocation', handleLocationFound);

    return () => {
      map.removeControl(searchControl);
      map.off('geosearch/showlocation', handleLocationFound);
    };
  }, [map, setPosition, onLocationChange]);
  
  return null;
}

function LocationMarker({ position, setPosition, onLocationChange }: any) {
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onLocationChange(e.latlng.lat, e.latlng.lng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return position === null ? null : (
    <Marker 
      position={position} 
      draggable={true}
      eventHandlers={{
        dragend: (e) => {
          const marker = e.target;
          const pos = marker.getLatLng();
          setPosition(pos);
          onLocationChange(pos.lat, pos.lng);
          map.flyTo(pos, map.getZoom());
        },
      }}
    />
  );
}

// A component to recenter the map if initial position changes from outside
function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    if (center[0] && center[1]) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
}

export default function LocationPickerMap({ initialLat, initialLng, onLocationChange }: LocationPickerMapProps) {
  // Default to Dhaka if no coordinates provided
  const defaultPosition: [number, number] = [23.8103, 90.4125];
  
  const [position, setPosition] = useState<L.LatLng | null>(
    initialLat && initialLng ? L.latLng(initialLat, initialLng) : null
  );

  const center = position ? [position.lat, position.lng] as [number, number] : defaultPosition;

  useEffect(() => {
    if (initialLat && initialLng && !position) {
      setPosition(L.latLng(initialLat, initialLng));
    }
  }, [initialLat, initialLng]);

  return (
    <div className="h-full w-full rounded-md border border-border overflow-hidden z-0 relative">
      <MapContainer center={center} zoom={13} scrollWheelZoom={true} style={{ height: '100%', width: '100%', zIndex: 0 }}>
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Satellite (Esri)">
            <TileLayer
              attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Street Map (OSM)">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>
        </LayersControl>
        <SearchField setPosition={setPosition} onLocationChange={onLocationChange} />
        <LocationMarker position={position} setPosition={setPosition} onLocationChange={onLocationChange} />
        {position && <MapUpdater center={[position.lat, position.lng]} />}
      </MapContainer>
      
      <div className="absolute bottom-6 right-2 z-[400]">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(
                (pos) => {
                  const latlng = L.latLng(pos.coords.latitude, pos.coords.longitude);
                  setPosition(latlng);
                  onLocationChange(latlng.lat, latlng.lng);
                },
                (err) => console.error(err),
                { enableHighAccuracy: true }
              );
            }
          }}
          className="bg-white p-2 rounded-md shadow-md border border-gray-200 hover:bg-gray-50 flex items-center justify-center text-black"
          title="Locate Me"
        >
          <Crosshair className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
