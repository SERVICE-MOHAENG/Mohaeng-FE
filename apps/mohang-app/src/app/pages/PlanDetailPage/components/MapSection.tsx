import React from 'react';
import { GoogleMap, MarkerF, PolylineF } from '@react-google-maps/api';

const mapDarkStyle = [
  { elementType: 'geometry', stylers: [{ color: '#1d2c4d' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#8ec3b9' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#1a3646' }] },
  {
    featureType: 'administrative.country',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#4b6878' }],
  },
  {
    featureType: 'landscape.natural',
    elementType: 'geometry',
    stylers: [{ color: '#023e58' }],
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [{ color: '#283d6a' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#304a7d' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#0e1626' }],
  },
];

interface MapSectionProps {
  isLoaded: boolean;
  center: google.maps.LatLngLiteral;
  zoom: number;
  onLoad: (map: google.maps.Map) => void;
  path: google.maps.LatLngLiteral[];
  scheduleItems: any[];
  activeDay: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

const MapSection: React.FC<MapSectionProps> = ({
  isLoaded,
  center,
  zoom,
  onLoad,
  path,
  scheduleItems,
  activeDay,
  onZoomIn,
  onZoomOut,
}) => {
  if (!isLoaded) return null;

  return (
    <div className="flex-1 relative">
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={center}
        zoom={zoom}
        onLoad={onLoad}
        options={{ disableDefaultUI: true, styles: mapDarkStyle }}
      >
        <PolylineF
          path={path}
          options={{
            strokeColor: '#22D3EE',
            strokeOpacity: 0.9,
            strokeWeight: 4,
          }}
        />
        {scheduleItems.map((marker, idx) => (
          <MarkerF
            key={`day-${activeDay}-marker-${marker.id}`}
            position={marker.position}
            label={{
              text: String(idx + 1),
              color: 'white',
              fontWeight: 'bold',
            }}
          />
        ))}
      </GoogleMap>

      {/* 왼쪽 하단: 줌 컨트롤 버튼 (+, -) */}
      <div className="absolute bottom-10 left-5 z-10 flex flex-col gap-2">
        <button
          onClick={onZoomIn}
          className="w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center text-2xl font-light hover:bg-gray-50 active:scale-90 transition-all text-gray-600"
        >
          <div className="mb-1">+</div>
        </button>
        <button
          onClick={onZoomOut}
          className="w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center text-2xl font-light hover:bg-gray-50 active:scale-90 transition-all text-gray-600"
        >
          <div className="mb-1">-</div>
        </button>
      </div>
    </div>
  );
};

export default MapSection;
