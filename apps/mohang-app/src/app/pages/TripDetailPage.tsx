import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

interface ScheduleItem {
  time: string;
  location: string;
  description: string;
  coordinates?: { lat: number; lng: number };
}

interface DaySchedule {
  day: number;
  date: string;
  items: ScheduleItem[];
}

const sampleSchedule: DaySchedule[] = [
  {
    day: 1,
    date: '2025.02.14 (금)',
    items: [
      { time: '10:30', location: '노이바이 국제공항 도착', description: '인천공항 06:30 출발 (VN411) → 하노이 노이바이공항 09:30 도착 후 입국 수속', coordinates: { lat: 21.2212, lng: 105.8071 } },
      { time: '11:00', location: '공항 택시 탑승', description: '노이바이공항에서 구시가지까지 택시 이동 (약 40분 소요, 300,000 VND)', coordinates: { lat: 21.2212, lng: 105.8071 } },
      { time: '11:50', location: '호텔 체크인', description: '하노이 라 시에스타 호텔 (La Siesta Premium Hang Be) - 딜럭스 더블룸 2개', coordinates: { lat: 21.0285, lng: 105.8542 } },
      { time: '12:30', location: '분짜 다끄 킴', description: '점심 식사 - 하노이 대표 음식 분짜 (1인 60,000 VND)', coordinates: { lat: 21.0278, lng: 105.8516 } },
      { time: '14:00', location: '호안끼엠 호수', description: '호텔에서 도보 5분, 하노이의 상징 호수 산책 및 응옥선 사원 방문', coordinates: { lat: 21.0285, lng: 105.8522 } },
      { time: '15:30', location: '구시가지 36거리', description: '전통 시장 탐방, 기념품 쇼핑 및 거리 음식 투어', coordinates: { lat: 21.0313, lng: 105.8516 } },
      { time: '17:00', location: '동쑤언 시장', description: '하노이 최대 재래시장 구경 (과일, 커피, 견과류 등)', coordinates: { lat: 21.0342, lng: 105.8495 } },
      { time: '19:00', location: '퀀안번 쩌우롱', description: '저녁 식사 - 전통 베트남 가정식 레스토랑 (1인 150,000 VND)', coordinates: { lat: 21.0299, lng: 105.8486 } },
      { time: '20:30', location: '타히엔 거리', description: '야시장 및 맥주 거리 산책, 비아허이 체험', coordinates: { lat: 21.0338, lng: 105.8519 } },
      { time: '22:00', location: '호텔 복귀', description: '첫날 일정 마무리 및 휴식', coordinates: { lat: 21.0285, lng: 105.8542 } },
    ],
  },
  {
    day: 2,
    date: '2025.02.15 (토)',
    items: [
      { time: '07:30', location: '호텔 조식', description: '호텔 루프탑 레스토랑 뷔페 (1인 200,000 VND)', coordinates: { lat: 21.0285, lng: 105.8542 } },
      { time: '08:30', location: '하롱베이 투어 픽업', description: '호텔 로비에서 하롱베이 일일 투어 버스 탑승', coordinates: { lat: 21.0285, lng: 105.8542 } },
      { time: '12:00', location: '하롱베이 크루즈 승선', description: '하노이에서 약 3시간 30분 이동 후 크루즈 탑승', coordinates: { lat: 20.9101, lng: 107.1839 } },
      { time: '12:30', location: '크루즈 중식', description: '선상에서 신선한 해산물 BBQ 뷔페 (투어 포함)', coordinates: { lat: 20.9101, lng: 107.1839 } },
      { time: '14:00', location: '띠엔꿍 동굴', description: '하롱베이 최대 석회암 동굴 탐험 (약 1시간)', coordinates: { lat: 20.9050, lng: 107.1711 } },
      { time: '15:30', location: '카약 체험', description: '에메랄드빛 바다에서 카약 및 수영 (약 1시간)', coordinates: { lat: 20.9120, lng: 107.1820 } },
      { time: '17:00', location: '크루즈 하선', description: '하롱베이 항구 도착 후 하선', coordinates: { lat: 20.9101, lng: 107.1839 } },
      { time: '20:30', location: '하노이 호텔 복귀', description: '투어 버스로 하노이 시내 복귀', coordinates: { lat: 21.0285, lng: 105.8542 } },
      { time: '21:00', location: '호텔 휴식', description: '하루 일정 마무리', coordinates: { lat: 21.0285, lng: 105.8542 } },
    ],
  },
  {
    day: 3,
    date: '2025.02.16 (일)',
    items: [
      { time: '08:00', location: '호텔 조식', description: '호텔 루프탑 레스토랑 뷔페', coordinates: { lat: 21.0285, lng: 105.8542 } },
      { time: '09:00', location: '호찌민 묘소', description: '택시로 이동 (약 15분, 80,000 VND), 베트남 건국의 아버지 호찌민 묘소 방문', coordinates: { lat: 21.0368, lng: 105.8345 } },
      { time: '10:00', location: '한기둥 사원', description: '호찌민 묘소에서 도보 5분, 연꽃 모양의 독특한 사원', coordinates: { lat: 21.0363, lng: 105.8339 } },
      { time: '11:00', location: '문묘', description: '베트남 최초의 대학, 공자를 모시는 유교 사원 (입장료 30,000 VND)', coordinates: { lat: 21.0277, lng: 105.8355 } },
      { time: '12:30', location: '짜까 레스토랑', description: '점심 식사 - 베트남 전통 음식 코스 요리 (1인 250,000 VND)', coordinates: { lat: 21.0341, lng: 105.8503 } },
      { time: '14:00', location: '호아로 수용소', description: '베트남 전쟁 역사 유적지 관람 (입장료 30,000 VND)', coordinates: { lat: 21.0237, lng: 105.8497 } },
      { time: '15:30', location: '호텔 체크아웃', description: '짐 정리 후 체크아웃, 프런트에 캐리어 맡기기', coordinates: { lat: 21.0285, lng: 105.8542 } },
      { time: '16:00', location: '빈콤 메가몰', description: '쇼핑몰에서 기념품 쇼핑 (G7 커피, 캐슈넛, 코코넛 캔디 등)', coordinates: { lat: 21.0228, lng: 105.8435 } },
      { time: '18:00', location: '호텔 복귀 및 짐 찾기', description: '프런트에서 캐리어 픽업', coordinates: { lat: 21.0285, lng: 105.8542 } },
      { time: '18:30', location: '공항 이동', description: '택시로 노이바이 공항 이동 (약 40분, 300,000 VND)', coordinates: { lat: 21.0285, lng: 105.8542 } },
      { time: '19:30', location: '노이바이 국제공항 도착', description: '체크인 카운터 이동 및 수속 (출발 2시간 전)', coordinates: { lat: 21.2212, lng: 105.8071 } },
      { time: '20:00', location: '공항 면세점 쇼핑', description: '베트남 커피, 럼주, 화장품 등 기념품 구매', coordinates: { lat: 21.2212, lng: 105.8071 } },
      { time: '21:30', location: '인천행 출발', description: 'VN412편 탑승 (21:30 출발 → 인천 익일 05:00 도착 예정)', coordinates: { lat: 21.2212, lng: 105.8071 } },
    ],
  },
];

export function TripDetailPage() {
  const navigate = useNavigate();
  const [selectedDay, setSelectedDay] = useState(1);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const polylineRef = useRef<any>(null);
  const infoWindowRef = useRef<any>(null);

  const currentSchedule = sampleSchedule.find(s => s.day === selectedDay) || sampleSchedule[0];

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
        center: { lat: 34.6937, lng: 135.5023 },
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
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');

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

      const locations = currentSchedule.items.filter(item => item.coordinates);
      if (locations.length === 0) return false;

    // 기존 InfoWindow 닫기
    if (infoWindowRef.current) {
      infoWindowRef.current.close();
      infoWindowRef.current = null;
    }

    // 기존 마커 완전히 제거
    if (markersRef.current.length > 0) {
      markersRef.current.forEach(marker => {
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
          position: { lat: item.coordinates!.lat, lng: item.coordinates!.lng },
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
          position: { lat: item.coordinates!.lat, lng: item.coordinates!.lng },
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

      bounds.extend({ lat: item.coordinates!.lat, lng: item.coordinates!.lng });
    });

    // 모든 지점을 직선으로 연결 (화살표와 색상 그라데이션 추가)
    if (locations.length >= 2) {
      const polylines: any[] = [];

      // 색상 보간 함수 (진한 빨강 → 주황 → 노랑 → 초록 → 파랑 → 보라)
      const getColor = (progress: number): string => {
        if (progress < 0.2) {
          // 진한 빨강 → 주황
          const r = 220;
          const g = Math.floor(20 + (120 * (progress / 0.2)));
          const b = 20;
          return `rgb(${r}, ${g}, ${b})`;
        } else if (progress < 0.4) {
          // 주황 → 진한 노랑
          const localProgress = (progress - 0.2) / 0.2;
          const r = Math.floor(220 - (30 * localProgress));
          const g = 140;
          const b = Math.floor(20 + (0 * localProgress));
          return `rgb(${r}, ${g}, ${b})`;
        } else if (progress < 0.6) {
          // 노랑 → 진한 초록
          const localProgress = (progress - 0.4) / 0.2;
          const r = Math.floor(190 - (175 * localProgress));
          const g = Math.floor(140 + (60 * localProgress));
          const b = Math.floor(20 + (30 * localProgress));
          return `rgb(${r}, ${g}, ${b})`;
        } else if (progress < 0.8) {
          // 초록 → 진한 파랑
          const localProgress = (progress - 0.6) / 0.2;
          const r = Math.floor(15 - (15 * localProgress));
          const g = Math.floor(200 - (105 * localProgress));
          const b = Math.floor(50 + (170 * localProgress));
          return `rgb(${r}, ${g}, ${b})`;
        } else {
          // 파랑 → 진한 보라
          const localProgress = (progress - 0.8) / 0.2;
          const r = Math.floor(0 + (130 * localProgress));
          const g = Math.floor(95 - (50 * localProgress));
          const b = 220;
          return `rgb(${r}, ${g}, ${b})`;
        }
      };

      // 각 구간별로 polyline 생성
      for (let i = 0; i < locations.length - 1; i++) {
        const start = { lat: locations[i].coordinates!.lat, lng: locations[i].coordinates!.lng };
        const end = { lat: locations[i + 1].coordinates!.lat, lng: locations[i + 1].coordinates!.lng };

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
          icons: [{
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
          }],
        });

        polylines.push(polyline);
      }

      // 모든 polyline을 저장
      polylineRef.current = {
        setMap: (map: any) => {
          polylines.forEach(line => line.setMap(map));
        }
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

  return (
    <div className="bg-gray-50 overflow-hidden overscroll-none touch-none" style={{ height: 'calc(100vh - 72px)' }}>
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
                <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span>
                <span className="font-semibold text-sm text-gray-900">뒤로</span>
              </button>
              <div className="px-5 py-3 bg-white/80 backdrop-blur-md rounded-full shadow-lg">
                <h1 className="text-xl font-bold text-gray-900">베트남 하노이 여행</h1>
              </div>
              {/* 여행 정보 */}
              <div className="px-5 py-3 bg-white/80 backdrop-blur-md rounded-full shadow-lg flex items-center">
                <div className="flex items-center gap-3 text-base text-gray-700">
                  <span>2025.02.14 - 02.16</span>
                  <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                  <span>2박 3일</span>
                  <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                  <span>4명</span>
                </div>
              </div>
            </div>

            {/* 태그 */}
            <div className="flex gap-2">
              <span className="px-4 py-2 bg-blue-600/80 backdrop-blur-md text-white rounded-full text-xs font-semibold shadow-lg">
                #하롱베이투어
              </span>
              <span className="px-4 py-2 bg-blue-600/80 backdrop-blur-md text-white rounded-full text-xs font-semibold shadow-lg">
                #가족여행
              </span>
            </div>
          </div>

          {/* 커스텀 줌 컨트롤 - 왼쪽 하단 */}
          <div className="absolute bottom-8 left-8 z-20 flex flex-col gap-2">
            <button
              onClick={handleZoomIn}
              className="w-12 h-12 bg-white/90 backdrop-blur-md rounded-full shadow-lg hover:bg-white hover:shadow-xl transition-all flex items-center justify-center group"
              aria-label="Zoom in"
            >
              <span className="text-2xl font-bold text-gray-700 group-hover:text-blue-600 transition-colors">+</span>
            </button>
            <button
              onClick={handleZoomOut}
              className="w-12 h-12 bg-white/90 backdrop-blur-md rounded-full shadow-lg hover:bg-white hover:shadow-xl transition-all flex items-center justify-center group"
              aria-label="Zoom out"
            >
              <span className="text-2xl font-bold text-gray-700 group-hover:text-blue-600 transition-colors">−</span>
            </button>
          </div>
        </div>

        {/* 오른쪽: 일정 영역 (22.2% = 1/4.5) */}
        <div className="bg-white flex flex-col" style={{ width: '22.2%' }}>
          {/* 일정 헤더 */}
          <div className="px-6 py-6 border-b border-gray-200">
            <h2 className="font-bold text-gray-900 text-lg">Day {selectedDay} 일정</h2>
            <p className="text-sm text-gray-500 mt-1">{currentSchedule.date}</p>
          </div>

          {/* 일정 리스트 */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
            {currentSchedule.items.map((item, index) => (
              <div key={index}>
                <div
                  className="flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group"
                  onClick={() => item.coordinates && handleLocationClick(item.coordinates.lat, item.coordinates.lng, index)}
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
                    <p className="text-sm text-gray-500 mb-1">
                      {item.time}
                    </p>
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
            ))}
          </div>
        </div>
      </div>

      {/* Day 선택 탭 - 지도 하단 중앙 오버레이 */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20" style={{ left: '38.9%' }}>
        <div className="flex gap-3 bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-3">
          {sampleSchedule.map((schedule) => (
            <button
              key={schedule.day}
              onClick={() => setSelectedDay(schedule.day)}
              className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all ${
                selectedDay === schedule.day
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <div className="text-xs opacity-75 mb-0.5">Day {schedule.day}</div>
              <div className="text-xs">{schedule.date}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TripDetailPage;
