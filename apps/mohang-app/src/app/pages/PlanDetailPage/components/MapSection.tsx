import React, { useState, useEffect, useCallback } from 'react';
import {
  GoogleMap,
  MarkerF,
  PolylineF,
  InfoWindowF,
} from '@react-google-maps/api';

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
  onMarkerClick?: (position: google.maps.LatLngLiteral) => void;
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
  onMarkerClick,
}) => {
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<any | null>(null);
  const [markerPhotos, setMarkerPhotos] = useState<Record<string, string>>({});

  const handleOnLoad = useCallback(
    (map: google.maps.Map) => {
      setMapInstance(map);
      onLoad(map);
    },
    [onLoad],
  );

  useEffect(() => {
    if (!selectedMarker || !mapInstance) return;

    const placeId = selectedMarker.id;
    if (markerPhotos[placeId]) return;

    const service = new google.maps.places.PlacesService(mapInstance);
    service.getDetails(
      {
        placeId: placeId,
        fields: ['photos'],
      },
      (place, status) => {
        if (
          status === google.maps.places.PlacesServiceStatus.OK &&
          place?.photos &&
          place.photos.length > 0
        ) {
          const photoUrl = place.photos[0].getUrl({
            maxWidth: 400,
            maxHeight: 300,
          });
          setMarkerPhotos((prev) => ({ ...prev, [placeId]: photoUrl }));
        }
      },
    );
  }, [selectedMarker, mapInstance]);

  if (!isLoaded) return null;

  return (
    <div className="flex-1 relative">
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={center}
        zoom={zoom}
        onLoad={handleOnLoad}
        options={{ disableDefaultUI: true, styles: mapDarkStyle }}
        onClick={() => setSelectedMarker(null)}
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
            onClick={() => {
              onMarkerClick && onMarkerClick(marker.position);
            }}
            onMouseOver={() => {
              setSelectedMarker({ ...marker, index: idx + 1 });
            }}
            onMouseOut={() => {
              setSelectedMarker(null);
            }}
            label={{
              text: String(idx + 1),
              color: 'white',
              fontWeight: 'bold',
            }}
          />
        ))}

        {selectedMarker && (
          <InfoWindowF
            position={selectedMarker.position}
            onCloseClick={() => setSelectedMarker(null)}
            options={{ disableAutoPan: true }}
          >
            <div className="p-0 m-0 min-w-[200px] overflow-hidden rounded-lg bg-white">
              {markerPhotos[selectedMarker.id] ? (
                <div className="relative h-28 w-full overflow-hidden">
                  <img
                    src={markerPhotos[selectedMarker.id]}
                    alt={selectedMarker.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-sky-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
                    Day {activeDay} · {selectedMarker.index}
                  </div>
                </div>
              ) : (
                <div className="relative h-28 w-full bg-gray-100 flex items-center justify-center">
                  <div className="animate-pulse flex flex-col items-center">
                    <div className="w-8 h-8 bg-gray-200 rounded-full mb-2"></div>
                    <div className="text-[10px] text-gray-400">
                      Loading Photo...
                    </div>
                  </div>
                </div>
              )}
              <div className="p-3">
                <h3 className="font-bold text-gray-900 text-[13px] mb-1 line-clamp-1">
                  {selectedMarker.title}
                </h3>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="text-sky-500 text-[10px] font-black uppercase">
                    {selectedMarker.time}
                  </span>
                </div>
                <p className="text-gray-500 text-[10px] leading-relaxed line-clamp-2">
                  {selectedMarker.location}
                </p>
              </div>
            </div>
          </InfoWindowF>
        )}
      </GoogleMap>

      {/* 왼쪽 하단: 줌 컨트롤 버튼 (+, -) */}
      <div className="absolute bottom-10 left-5 z-20 flex flex-col gap-3">
        <button
          onClick={onZoomIn}
          className="w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center text-3xl font-light hover:bg-gray-50 active:scale-90 transition-all text-gray-600 select-none pb-1 cursor-pointer"
        >
          +
        </button>
        <button
          onClick={onZoomOut}
          className="w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center text-3xl font-light hover:bg-gray-50 active:scale-90 transition-all text-gray-600 select-none pb-1 cursor-pointer"
        >
          -
        </button>
      </div>
    </div>
  );
};

export default MapSection;
