import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { getCourseDetail, LoadingScreen, colors } from '@mohang/ui';

interface ScheduleItem {
  time: string;
  location: string;
  description: string;
  coordinates?: { lat: number; lng: number };
  order: number;
}

interface DaySchedule {
  day: number;
  date: string;
  items: ScheduleItem[];
}

// Sample mock data removed as we move to real API data.

export function TripDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [courseData, setCourseData] = useState<any>(null);
  const [schedule, setSchedule] = useState<DaySchedule[]>([]);
  const [selectedDay, setSelectedDay] = useState(1);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const polylineRef = useRef<any>(null);
  const infoWindowRef = useRef<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const res = await getCourseDetail(id);
        const data = res.data;
        if (!data) return;
        
        setCourseData(data);

        // Group places by day_number (already grouped in itinerary)
        const sortedSchedule = (data.itinerary || []).map((day) => ({
          day: day.day_number,
          date: day.daily_date || `Day ${day.day_number}`,
          items: day.places.map((p) => ({
            time: p.visit_time || (p.visit_sequence !== undefined ? `${p.visit_sequence}번째 방문` : '시간 미지정'),
            location: p.place_name || '알 수 없는 장소',
            description: p.description || '',
            order: p.visit_sequence !== undefined ? p.visit_sequence : 999,
            coordinates:
              p.latitude && p.longitude
                ? { lat: Number(p.latitude), lng: Number(p.longitude) }
                : undefined,
          })),
        }));
        
        setSchedule(sortedSchedule);
      } catch (error) {
        console.error('getCourseDetail Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const currentSchedule =
    schedule.find((s) => s.day === selectedDay) || schedule[0];

  const handleLocationClick = (lat: number, lng: number, index: number) => {
    if (mapInstanceRef.current && markersRef.current[index]) {
      const google = (window as any).google;
      const map = mapInstanceRef.current;

      // 부드러운 애니메이션으로 이동
      map.panTo({ lat, lng });

      // 줌 레벨을 부드럽게 변경
      setTimeout(() => {
        map.setZoom(15);
      }, 300);

      // 기존 InfoWindow 닫기
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
      }

      // InfoWindow를 애니메이션 후에 열기
      setTimeout(() => {
        if (!currentSchedule || !currentSchedule.items[index]) return;
        const infoWindow = new google.maps.InfoWindow({
          content: `<div style="padding: 8px;"><b>${index + 1}. ${currentSchedule.items[index].location}</b><br/>${currentSchedule.items[index].time}</div>`,
        });
        infoWindow.open(map, markersRef.current[index]);
        infoWindowRef.current = infoWindow;
      }, 600);
    }
  };

  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      const currentZoom = mapInstanceRef.current.getZoom();
      mapInstanceRef.current.setZoom(currentZoom + 1);
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      const currentZoom = mapInstanceRef.current.getZoom();
      mapInstanceRef.current.setZoom(currentZoom - 1);
    }
  };

  // Google Maps 초기 로드 (한 번만 실행)
  useEffect(() => {
    const initMap = () => {
      if (!mapRef.current) return;
      if (!(window as any).google || !(window as any).google.maps) return;

      const google = (window as any).google;

      // 지도가 이미 생성되어 있으면 초기화하지 않음
      if (mapInstanceRef.current) return;

      // 지도 생성 (처음 한 번만)
      const map = new google.maps.Map(mapRef.current, {
        center: { lat: 37.5665, lng: 126.978 }, // Default to Seoul
        zoom: 12,
        disableDefaultUI: true, // 모든 기본 UI 숨김
        zoomControl: false,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        gestureHandling: 'greedy', // 스크롤 동작 개선
      });

      mapInstanceRef.current = map;
    };

    // 이미 로드 중인지 확인
    const existingScript = document.querySelector(
      'script[src*="maps.googleapis.com"]',
    );

    if ((window as any).google && (window as any).google.maps) {
      // 이미 로드됨
      initMap();
    } else if (!existingScript) {
      // 스크립트가 없으면 로드
      const script = document.createElement('script');
      script.id = 'google-maps-script';
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAwwVNf_yKqgvyJ5J2ygnqxMmp-Z8YADgU`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        initMap();
      };
      script.onerror = () => {
        console.error('Google Maps 로드 실패');
      };

      document.head.appendChild(script);
    } else {
      // 스크립트 로드 중이면 대기
      const checkGoogleMaps = setInterval(() => {
        if ((window as any).google && (window as any).google.maps) {
          clearInterval(checkGoogleMaps);
          initMap();
        }
      }, 100);

      return () => clearInterval(checkGoogleMaps);
    }
  }, []);

  // Day 변경 시 마커와 경로만 업데이트
  useEffect(() => {
    // 지도가 준비될 때까지 대기
    const updateMarkers = () => {
      if (!mapInstanceRef.current || !(window as any).google) return false;

      const google = (window as any).google;
      const map = mapInstanceRef.current;

      if (!currentSchedule) return false;

      const locations = currentSchedule.items.filter(
        (item) => item.coordinates,
      );
      if (locations.length === 0) return false;

      // 기존 InfoWindow 닫기
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
        infoWindowRef.current = null;
      }

      // 기존 마커 완전히 제거
      if (markersRef.current.length > 0) {
        markersRef.current.forEach((marker) => {
          marker.setMap(null);
        });
        markersRef.current = [];
      }

      // 기존 경로선 제거 (DirectionsRenderer 또는 Polyline)
      if (polylineRef.current) {
        if (typeof polylineRef.current.setMap === 'function') {
          polylineRef.current.setMap(null);
        }
        if (typeof polylineRef.current.setDirections === 'function') {
          polylineRef.current.setDirections({ routes: [] });
        }
        polylineRef.current = null;
      }

      const bounds = new google.maps.LatLngBounds();

      // 좌표가 같은 위치들을 그룹화
      const locationGroups = new Map<string, number[]>();
      locations.forEach((item, index) => {
        const key = `${item.coordinates!.lat},${item.coordinates!.lng}`;
        if (!locationGroups.has(key)) {
          locationGroups.set(key, []);
        }
        locationGroups.get(key)!.push(index);
      });

      // 마커 추가
      locations.forEach((item, index) => {
        const key = `${item.coordinates!.lat},${item.coordinates!.lng}`;
        const group = locationGroups.get(key)!;
        const isSameLocation = group.length > 1;

        let marker;

        if (isSameLocation) {
          // 같은 좌표면 원으로 표시
          const circleIcon = {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: '#3b82f6',
            fillOpacity: 0.8,
            strokeColor: '#1e40af',
            strokeWeight: 2,
            scale: 10,
          };

          marker = new google.maps.Marker({
            position: {
              lat: item.coordinates!.lat,
              lng: item.coordinates!.lng,
            },
            map: map,
            title: item.location,
            icon: circleIcon,
          });
        } else {
          // 다른 좌표면 숫자 마커
          const blueIcon = {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: '#3b82f6',
            fillOpacity: 1,
            strokeColor: '#1e40af',
            strokeWeight: 3,
            scale: 12,
          };

          marker = new google.maps.Marker({
            position: {
              lat: item.coordinates!.lat,
              lng: item.coordinates!.lng,
            },
            map: map,
            title: item.location,
            icon: blueIcon,
            label: {
              text: String(index + 1),
              color: 'white',
              fontSize: '12px',
              fontWeight: 'bold',
            },
          });
        }

        markersRef.current.push(marker);

        // 마커 클릭 이벤트
        marker.addListener('click', () => {
          if (infoWindowRef.current) {
            infoWindowRef.current.close();
          }

          const infoWindow = new google.maps.InfoWindow({
            content: `<div style="padding: 8px;"><b>${index + 1}. ${item.location}</b><br/>${item.time}</div>`,
          });
          infoWindow.open(map, marker);
          infoWindowRef.current = infoWindow;
        });

        bounds.extend({
          lat: item.coordinates!.lat,
          lng: item.coordinates!.lng,
        });
      });

      // 모든 지점을 직선으로 연결 (화살표와 색상 그라데이션 추가)
      if (locations.length >= 2) {
        const polylines: any[] = [];

        // 색상 보간 함수 (진한 빨강 → 주황 → 노랑 → 초록 → 파랑 → 보라)
        const getColor = (progress: number): string => {
          if (progress < 0.2) {
            // 진한 빨강 → 주황
            const r = 220;
            const g = Math.floor(20 + 120 * (progress / 0.2));
            const b = 20;
            return `rgb(${r}, ${g}, ${b})`;
          } else if (progress < 0.4) {
            // 주황 → 진한 노랑
            const localProgress = (progress - 0.2) / 0.2;
            const r = Math.floor(220 - 30 * localProgress);
            const g = 140;
            const b = Math.floor(20 + 0 * localProgress);
            return `rgb(${r}, ${g}, ${b})`;
          } else if (progress < 0.6) {
            // 노랑 → 진한 초록
            const localProgress = (progress - 0.4) / 0.2;
            const r = Math.floor(190 - 175 * localProgress);
            const g = Math.floor(140 + 60 * localProgress);
            const b = Math.floor(20 + 30 * localProgress);
            return `rgb(${r}, ${g}, ${b})`;
          } else if (progress < 0.8) {
            // 초록 → 진한 파랑
            const localProgress = (progress - 0.6) / 0.2;
            const r = Math.floor(15 - 15 * localProgress);
            const g = Math.floor(200 - 105 * localProgress);
            const b = Math.floor(50 + 170 * localProgress);
            return `rgb(${r}, ${g}, ${b})`;
          } else {
            // 파랑 → 진한 보라
            const localProgress = (progress - 0.8) / 0.2;
            const r = Math.floor(0 + 130 * localProgress);
            const g = Math.floor(95 - 50 * localProgress);
            const b = 220;
            return `rgb(${r}, ${g}, ${b})`;
          }
        };

        // 각 구간별로 polyline 생성
        for (let i = 0; i < locations.length - 1; i++) {
          const start = {
            lat: locations[i].coordinates!.lat,
            lng: locations[i].coordinates!.lng,
          };
          const end = {
            lat: locations[i + 1].coordinates!.lat,
            lng: locations[i + 1].coordinates!.lng,
          };

          // 같은 좌표면 선 그리지 않음
          if (start.lat === end.lat && start.lng === end.lng) {
            continue;
          }

          // 진행도에 따른 색상 계산
          const progress = i / Math.max(1, locations.length - 2);
          const color = getColor(progress);

          const polyline = new google.maps.Polyline({
            path: [start, end],
            geodesic: true,
            strokeColor: color,
            strokeOpacity: 1,
            strokeWeight: 4,
            map: map,
            icons: [
              {
                icon: {
                  path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                  fillColor: color,
                  fillOpacity: 1,
                  strokeColor: color,
                  strokeWeight: 1,
                  scale: 3,
                },
                offset: '50%',
                repeat: '100px',
              },
            ],
          });

          polylines.push(polyline);
        }

        // 모든 polyline을 저장
        polylineRef.current = {
          setMap: (map: any) => {
            polylines.forEach((line) => line.setMap(map));
          },
        };
      }

      // 지도 범위 조정
      map.fitBounds(bounds);
      return true;
    };

    // 즉시 실행 시도
    const success = updateMarkers();

    // 실패하면 지도가 준비될 때까지 대기
    if (!success) {
      const checkMap = setInterval(() => {
        if (updateMarkers()) {
          clearInterval(checkMap);
        }
      }, 100);

      return () => clearInterval(checkMap);
    }
  }, [selectedDay, currentSchedule]);

  if (loading) {
    return <LoadingScreen message="여행 일정을 불러오는 중입니다..." />;
  }

  if (!courseData) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <p className="text-gray-500 mb-4">일정을 찾을 수 없습니다.</p>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2 bg-blue-600 text-white rounded-full font-semibold"
        >
          뒤로 가기
        </button>
      </div>
    );
  }

  return (
    <div
      className="bg-gray-50 overflow-hidden overscroll-none touch-none"
      style={{ height: 'calc(100vh - 72px)' }}
    >
      {/* 메인 레이아웃 */}
      <div className="flex h-full">
        {/* 왼쪽: 지도 영역 (77.8% = 3.5/4.5) */}
        <div className="relative" style={{ width: '77.8%' }}>
          <div ref={mapRef} className="w-full h-full" />

          {/* 왼쪽 상단 헤더 오버레이 - 알약형 */}
          <div className="absolute top-8 left-8 z-20 flex flex-col gap-3">
            {/* 여행 제목과 뒤로가기 버튼 */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 px-5 py-3 bg-white/80 backdrop-blur-md rounded-full shadow-lg hover:bg-white/90 transition-all group"
              >
                <span className="text-lg group-hover:-translate-x-1 transition-transform">
                  ←
                </span>
                <span className="font-semibold text-sm text-gray-900">
                  뒤로
                </span>
              </button>
              <div className="px-5 py-3 bg-white/80 backdrop-blur-md rounded-[20px] shadow-lg flex flex-col gap-1">
                <h1 className="text-xl font-bold text-gray-900">
                  {courseData?.title || '여행 코스 상세'}
                </h1>
              </div>
              {/* 여행 정보 */}
              <div className="px-5 py-3 bg-white/80 backdrop-blur-md rounded-full shadow-lg flex items-center">
                <div className="flex items-center gap-3 text-base text-gray-700">
                  <span>
                    {courseData?.nights !== undefined
                      ? `${courseData.nights}박 ${courseData.trip_days}일`
                      : '일정 확인 중'}
                  </span>
                  {courseData?.userName && !(courseData as any).isMine && !(courseData as any).is_owner && (
                    <>
                      <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                      <span>{courseData.userName}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              {(courseData?.tags || []).map((tag: string) => (
                <span
                  key={tag}
                  className="px-4 py-2 bg-blue-600/80 backdrop-blur-md text-white rounded-full text-xs font-semibold shadow-lg"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* 커스텀 줌 컨트롤 - 왼쪽 하단 */}
          <div className="absolute bottom-8 left-8 z-20 flex flex-col gap-2">
            <button
              onClick={handleZoomIn}
              className="w-12 h-12 bg-white/90 backdrop-blur-md rounded-full shadow-lg hover:bg-white hover:shadow-xl transition-all flex items-center justify-center group"
              aria-label="Zoom in"
            >
              <span className="text-2xl font-bold text-gray-700 group-hover:text-blue-600 transition-colors">
                +
              </span>
            </button>
            <button
              onClick={handleZoomOut}
              className="w-12 h-12 bg-white/90 backdrop-blur-md rounded-full shadow-lg hover:bg-white hover:shadow-xl transition-all flex items-center justify-center group"
              aria-label="Zoom out"
            >
              <span className="text-2xl font-bold text-gray-700 group-hover:text-blue-600 transition-colors">
                −
              </span>
            </button>
          </div>
        </div>

        {/* 오른쪽: 일정 영역 (22.2% = 1/4.5) */}
        <div className="bg-white flex flex-col" style={{ width: '22.2%' }}>
          {/* 일정 헤더 */}
          <div className="px-6 py-6 border-b border-gray-200">
            <h2 className="font-bold text-gray-900 text-lg">
              Day {selectedDay} 일정
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {currentSchedule?.date || ''}
            </p>
          </div>

          {/* 일정 리스트 */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
            {!currentSchedule || currentSchedule.items.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                일정이 없습니다.
              </div>
            ) : (
              currentSchedule.items.map((item, index) => (
                <div key={index}>
                  <div
                    className="flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group"
                    onClick={() =>
                      item.coordinates &&
                      handleLocationClick(
                        item.coordinates.lat,
                        item.coordinates.lng,
                        index,
                      )
                    }
                  >
                    {/* 순서 */}
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-md shadow-blue-200 group-hover:shadow-lg group-hover:scale-105 transition-all">
                        <span className="text-white font-bold text-xl">
                          {index + 1}
                        </span>
                      </div>
                    </div>

                    {/* 내용 */}
                    <div className="flex-1 min-w-0 pt-1">
                      <h3 className="font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                        {item.location}
                      </h3>
                      <p className="text-sm text-gray-500 mb-1">{item.time}</p>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* 연결선 */}
                  {index < currentSchedule.items.length - 1 && (
                    <div className="flex justify-start pl-11">
                      <div className="w-0.5 h-6 bg-gradient-to-b from-blue-400 to-blue-200"></div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Day 선택 탭 - 지도 하단 중앙 오버레이 */}
      <div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20"
        style={{ left: '38.9%' }}
      >
        <div className="flex gap-3 bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-3">
          {schedule.map((s) => (
            <button
              key={s.day}
              onClick={() => setSelectedDay(s.day)}
              className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all ${
                selectedDay === s.day
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <div className="text-xs opacity-75 mb-0.5">Day {s.day}</div>
              <div className="text-xs">{s.date}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TripDetailPage;
