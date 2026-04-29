import React, { useState, useEffect, useCallback } from 'react';
import {
  GoogleMap,
  MarkerF,
  PolylineF,
  InfoWindowF,
} from '@react-google-maps/api';
import type { NormalizedSchedulePlace } from '../../../utils/placeSchema';

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
  scheduleItems: NormalizedSchedulePlace[];
  activeDay: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onMarkerClick?: (position: google.maps.LatLngLiteral) => void;
  selectedMarkerId?: string | null;
  onSelectedMarkerChange?: (
    marker: (NormalizedSchedulePlace & { index?: number }) | null,
  ) => void;
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
  selectedMarkerId,
  onSelectedMarkerChange,
}) => {
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [markerPhotos, setMarkerPhotos] = useState<Record<string, string>>({});
  const mappableScheduleItems = scheduleItems.filter(
    (item): item is NormalizedSchedulePlace & {
      position: google.maps.LatLngLiteral;
    } => Boolean(item.position),
  );
  const selectedMarker =
    mappableScheduleItems.find((item) => item.id === selectedMarkerId) || null;
  const selectedMarkerOrder = selectedMarker
    ? mappableScheduleItems.findIndex((item) => item.id === selectedMarker.id) + 1
    : null;

  const handleOnLoad = useCallback(
    (map: google.maps.Map) => {
      setMapInstance(map);
      onLoad(map);
    },
    [onLoad],
  );

  useEffect(() => {
    if (!selectedMarker || !mapInstance) return;

    const placeId = selectedMarker.placeId || selectedMarker.id;
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

  const handleMarkerClick = (
    marker: NormalizedSchedulePlace & { position: google.maps.LatLngLiteral },
    idx: number,
  ) => {
    const nextMarker = { ...marker, index: idx + 1 };

    const isSameMarker =
      selectedMarkerId === nextMarker.id ||
      selectedMarkerId === nextMarker.placeId;

    onSelectedMarkerChange?.(isSameMarker ? null : nextMarker);

    onMarkerClick?.(marker.position);
  };

  if (!isLoaded) return null;

  return (
    <div className="flex-1 relative">
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={center}
        zoom={zoom}
        onLoad={handleOnLoad}
        options={{ disableDefaultUI: true, styles: mapDarkStyle }}
        onClick={() => onSelectedMarkerChange?.(null)}
      >
        <PolylineF
          path={path}
          options={{
            strokeColor: '#22D3EE',
            strokeOpacity: 0.9,
            strokeWeight: 4,
          }}
        />
        {mappableScheduleItems.map((marker, idx) => (
          <MarkerF
            key={`day-${activeDay}-marker-${marker.id}`}
            position={marker.position}
            onClick={() => handleMarkerClick(marker, idx)}
            label={{
              text: String(idx + 1),
              color: 'white',
              fontWeight: 'bold',
            }}
            shape={{ coords: [14, 14, 25], type: 'circle' }} // Increased hit area
          />
        ))}

        {selectedMarker && (
          <InfoWindowF
            position={selectedMarker.position}
            onCloseClick={() => onSelectedMarkerChange?.(null)}
            options={{ disableAutoPan: true }}
          >
              <div 
                className="p-0 m-0 min-w-[200px] overflow-hidden rounded-lg bg-white shadow-2xl border border-gray-100"
              >
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${selectedMarker.title} ${selectedMarker.location || ''}`.trim())}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group"
                >
                  {markerPhotos[selectedMarker.placeId || selectedMarker.id] ? (
                    <div className="relative h-32 w-full overflow-hidden">
                      <img
                        src={markerPhotos[selectedMarker.placeId || selectedMarker.id]}
                        alt={selectedMarker.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                      <div className="absolute top-2 left-2 bg-sky-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md z-10">
                        Day {activeDay} - {selectedMarkerOrder}
                      </div>
                      <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          <polyline points="15 3 21 3 21 9" />
                          <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                      </div>
                    </div>
                  ) : (
                    <div className="relative h-32 w-full bg-gray-50 flex items-center justify-center">
                      <div className="animate-pulse flex flex-col items-center">
                        <div className="w-8 h-8 bg-sky-100 rounded-full mb-2"></div>
                        <div className="text-[10px] text-gray-400 font-medium">
                          이미지 준비 중...
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="p-3.5">
                    <h3 className="font-bold text-gray-900 text-[14px] mb-1.5 line-clamp-1 group-hover:text-sky-600 transition-colors">
                      {selectedMarker.title}
                    </h3>
                    <div className="mb-2">
                      <span
                        className={`inline-flex rounded-full border px-2 py-1 text-[10px] font-bold ${
                          selectedMarker.isCategoryFallback
                            ? 'border-gray-200 bg-gray-100 text-gray-500'
                            : 'border-sky-100 bg-sky-50 text-sky-600'
                        }`}
                      >
                        {selectedMarker.placeCategoryLabel}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 mb-1.5 text-sky-500">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      <span className="text-[11px] font-bold pt-0.5">
                        {selectedMarker.time}
                      </span>
                    </div>
                    <p className="text-gray-500 text-[10px] leading-relaxed line-clamp-2">
                      {selectedMarker.location}
                    </p>
                    <p className="mt-1 text-gray-400 text-[10px] leading-relaxed line-clamp-2">
                      {selectedMarker.description || '장소 설명이 아직 없어요.'}
                    </p>
                    <div className="mt-3 pt-2 border-t border-gray-50 flex items-center gap-1">
                      <span className="text-sky-500 text-[11px] font-semibold hover:underline cursor-pointer flex items-center gap-1">
                        Google Maps에서 보기
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="15 3 21 3 21 9" />
                          <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </a>
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
