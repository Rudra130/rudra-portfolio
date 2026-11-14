import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useUniverseStore } from '../../../store/useUniverseStore';
import { worldsData } from '../../../data/worlds';
import { celestialPositions } from '../celestial/PlanetarySystem';

export const CameraController: React.FC = () => {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);

  const { activeWorldId, cameraMode, setCameraMode, zoomLevel } = useUniverseStore();

  // Overview camera: high top-down vantage point looking down at the Sun with all planets revolving around it
  const overviewPos = useRef(new THREE.Vector3(0, 360, 180));
  const sunCenter = useRef(new THREE.Vector3(0, 0, 0));

  // Synchronize button zoom changes from HUD relative to current control target
  const prevZoomLevel = useRef(zoomLevel);
  useEffect(() => {
    if (controlsRef.current && prevZoomLevel.current !== zoomLevel) {
      const factor = prevZoomLevel.current / zoomLevel;
      const target = controlsRef.current.target as THREE.Vector3;
      const offset = new THREE.Vector3().subVectors(camera.position, target);
      offset.multiplyScalar(factor);
      camera.position.copy(target).add(offset);
      controlsRef.current.update();
      prevZoomLevel.current = zoomLevel;
    }
  }, [zoomLevel, camera]);

  useFrame((_, delta) => {
    if (activeWorldId) {
      const world = worldsData.find((w) => w.id === activeWorldId);
      if (world) {
        // Read accurate live 3D coordinate of the focused celestial body
        const pos = celestialPositions[activeWorldId] || [0, 0, 0];
        const px = pos[0];
        const py = pos[1];
        const pz = pos[2];

        const dist = world.cameraDistance;

        // Target is shifted to the RIGHT of the planet (+0.45 * dist)
        // so the planet is squarely projected in the LEFT ~25-30% of the screen
        const targetVec = new THREE.Vector3(
          px + dist * 0.45,
          py,
          pz
        );

        // Position camera in front of the target with slight vertical elevation
        const camVec = new THREE.Vector3(
          px + dist * 0.40,
          py + dist * 0.12,
          pz + dist * 1.15
        );

        if (cameraMode === 'APPROACHING') {
          camera.position.lerp(camVec, delta * 4.2);
          if (controlsRef.current) {
            controlsRef.current.target.lerp(targetVec, delta * 4.2);
            controlsRef.current.update();
          }

          if (camera.position.distanceTo(camVec) < 0.4) {
            setCameraMode('INSPECTING');
          }
        } else if (cameraMode === 'INSPECTING') {
          // Lock target so the planet stays solidly framed on the left
          if (controlsRef.current) {
            controlsRef.current.target.copy(targetVec);
          }
        }
      }
    } else {
      // Returning to Overview
      if (cameraMode === 'RETURNING') {
        const currentOverview = overviewPos.current;

        camera.position.lerp(currentOverview, delta * 3.8);
        if (controlsRef.current) {
          controlsRef.current.target.lerp(sunCenter.current, delta * 3.8);
          controlsRef.current.update();
        }

        if (camera.position.distanceTo(currentOverview) < 1.0) {
          camera.position.copy(currentOverview);
          if (controlsRef.current) {
            controlsRef.current.target.copy(sunCenter.current);
            controlsRef.current.update();
          }
          setCameraMode('OVERVIEW');
        }
      }
      // When in 'OVERVIEW', never modify camera or target so mouse wheel zoom & orbit drag are 100% natural!
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={true}
      enableZoom={true}
      zoomSpeed={1.2}
      rotateSpeed={0.8}
      enableRotate={true}
      minDistance={15}
      maxDistance={900}
      maxPolarAngle={Math.PI / 2 - 0.05} // prevent clipping through ground plane
      minPolarAngle={Math.PI / 16}
      dampingFactor={0.06}
      enabled={cameraMode === 'OVERVIEW'}
    />
  );
};
