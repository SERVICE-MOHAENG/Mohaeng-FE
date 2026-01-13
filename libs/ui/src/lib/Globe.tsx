import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';
import styles from './Globe.module.css';
import { colors, typography } from '@mohang/ui';
import sendIcon from '../assets/send.svg';

interface Location {
  lat: number;
  lon: number;
  city: string;
  visits: number;
}

const visitedLocations: Location[] = [
  { lat: 37.5665, lon: 126.978, city: 'Seoul', visits: 5 },
  { lat: 35.6762, lon: 139.6503, city: 'Tokyo', visits: 3 },
  { lat: 40.7128, lon: -74.006, city: 'New York', visits: 2 },
  { lat: 51.5074, lon: -0.1278, city: 'London', visits: 1 },
  { lat: 48.8566, lon: 2.3522, city: 'Paris', visits: 2 },
];

function latLonToVector3(lat: number, lon: number, radius = 1) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  return new THREE.Vector3(x, y, z);
}

function Stars() {
  const starsRef = useRef<THREE.Points>(null);

  const starVertices = useMemo(() => {
    const vertices = [];
    for (let i = 0; i < 2000; i++) {
      vertices.push(
        (Math.random() - 0.5) * 200,
        (Math.random() - 0.5) * 200,
        (Math.random() - 0.5) * 200,
      );
    }
    return new Float32Array(vertices);
  }, []);

  useFrame(() => {
    if (starsRef.current) {
      starsRef.current.rotation.y += 0.0001;
    }
  });

  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(starVertices, 3));
    return geom;
  }, [starVertices]);

  return (
    <points ref={starsRef} geometry={geometry}>
      <pointsMaterial color={0xffffff} size={0.2} />
    </points>
  );
}

function EarthWithMarkers() {
  const earthRef = useRef<THREE.Group>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const rotationVelocity = useRef({ x: 0, y: 0 });
  const autoRotateTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  const earthTexture = useLoader(
    THREE.TextureLoader,
    'https://unpkg.com/three-globe@2.24.13/example/img/earth-blue-marble.jpg',
  );

  const bumpTexture = useLoader(
    THREE.TextureLoader,
    'https://unpkg.com/three-globe@2.24.13/example/img/earth-topology.png',
  );

  useFrame(() => {
    if (!earthRef.current) return;

    if (autoRotate) {
      earthRef.current.rotation.y += 0.002;
    } else {
      rotationVelocity.current.x *= 0.95;
      rotationVelocity.current.y *= 0.95;
      earthRef.current.rotation.x += rotationVelocity.current.x;
      earthRef.current.rotation.y += rotationVelocity.current.y;
    }
  });

  const handlePointerDown = (e: any) => {
    setIsDragging(true);
    setAutoRotate(false);
    if (autoRotateTimeout.current) {
      clearTimeout(autoRotateTimeout.current);
    }
  };

  const handlePointerMove = (e: any) => {
    if (!isDragging || !earthRef.current) return;
    rotationVelocity.current = {
      x: e.movementY * 0.005,
      y: e.movementX * 0.005,
    };
    earthRef.current.rotation.y += e.movementX * 0.005;
    earthRef.current.rotation.x += e.movementY * 0.005;
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    autoRotateTimeout.current = setTimeout(() => {
      setAutoRotate(true);
    }, 8000);
  };

  return (
    <group
      ref={earthRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <Sphere args={[1, 64, 64]}>
        <meshPhongMaterial
          map={earthTexture}
          bumpMap={bumpTexture}
          bumpScale={0.05}
        />
      </Sphere>

      {visitedLocations.map((location, index) => {
        const position = latLonToVector3(location.lat, location.lon, 1.01);
        return (
          <group key={index}>
            <mesh position={position}>
              <sphereGeometry args={[0.03, 16, 16]} />
              <meshBasicMaterial color={0xffffff} transparent opacity={0.5} />
            </mesh>
            <mesh position={position}>
              <sphereGeometry args={[0.05, 16, 16]} />
              <meshBasicMaterial color={0xffffff} transparent opacity={0.15} />
            </mesh>
          </group>
        );
      })}

      <Sphere args={[1.02, 64, 64]}>
        <meshPhongMaterial
          color={0x88ccff}
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </Sphere>
    </group>
  );
}

export interface GlobeProps {
  className?: string;
}

export function Globe({ className = '' }: GlobeProps) {
  const [inputValue, setInputValue] = useState('');
  return (
    <div className={`${styles.globeContainer} ${className}`}>
      <div className={styles.capsuleOverlay}>
        <div
          className={styles.capsuleTitle}
          style={{ ...typography.headline.HeadlineM }}
        >
          <p>지금 여행 일정을</p>
          <p> 같이 계획해볼까요?</p>
        </div>
        <input
          className={styles.capsule}
          placeholder="여행일정을 짜고 싶으신가요?"
          value={inputValue}
          type="text"
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button className={styles.arrow}>
          <img src={sendIcon} alt="send" />
        </button>
      </div>
      <div className={styles.globeCanvas}>
        <Canvas
          camera={{ position: [0, 0, 3.5], fov: 45 }}
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: 'high-performance',
          }}
        >
          <color attach="background" args={['#000000']} />
          <ambientLight intensity={2.0} />
          <directionalLight position={[5, 3, 5]} intensity={2.5} />
          <directionalLight position={[-5, -3, -5]} intensity={1.5} />
          <pointLight position={[0, 5, 0]} intensity={1.0} />
          <Stars />
          <EarthWithMarkers />
        </Canvas>
      </div>
    </div>
  );
}

export default Globe;
