import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useUniverseStore } from '../../../store/useUniverseStore';
import { worldsData } from '../../../data/worlds';

export const CameraController: React.FC = () => {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);

  const { activeWorldId, cameraMode, setCameraMode, zoomLevel } = useUniverseStore();

  const overviewPos = useRef(new THREE.Vector3(0, 48, 110));
  const isTransitioning = useRef(false);

  // Synchronize button zoom changes from HUD
  const prevZoomLevel = useRef(zoomLevel);
  useEffect(() => {
    if (controlsRef.current && prevZoomLevel.current !== zoomLevel) {
      const factor = prevZoomLevel.current / zoomLevel;
      camera.position.multiplyScalar(factor);
      controlsRef.current.update();
      prevZoomLevel.current = zoomLevel;
    }
  }, [zoomLevel, camera]);

  useFrame((_, delta) => {
    if (activeWorldId) {
      const world = worldsData.find((w) => w.id === activeWorldId);
      if (world) {
        let targetX = 0;
        let targetZ = 0;
        if (world.orbitRadius > 0) {
          targetX = world.orbitRadius * 0.7;
          targetZ = world.orbitRadius * 0.7;
        }

        const worldCenter = new THREE.Vector3(targetX, 0, targetZ);
        // Position camera to frame the planet on the left side
        const targetCam = new THREE.Vector3(
          targetX + world.cameraDistance * 0.6,
          world.cameraDistance * 0.35,
          targetZ + world.cameraDistance * 1.2
        );

        if (cameraMode === 'APPROACHING') {
          camera.position.lerp(targetCam, delta * 3.5);
          if (controlsRef.current) {
            controlsRef.current.target.lerp(worldCenter, delta * 3.5);
            controlsRef.current.update();
          }

          if (camera.position.distanceTo(targetCam) < 0.4) {
            setCameraMode('INSPECTING');
          }
        }
      }
    } else {
      // Returning to Overview
      if (cameraMode === 'RETURNING') {
        isTransitioning.current = true;
        const currentOverview = overviewPos.current.clone();
        const sunCenter = new THREE.Vector3(0, 0, 0);

        camera.position.lerp(currentOverview, delta * 3.0);
        if (controlsRef.current) {
          controlsRef.current.target.lerp(sunCenter, delta * 3.0);
          controlsRef.current.update();
        }

        if (camera.position.distanceTo(currentOverview) < 0.8) {
          setCameraMode('OVERVIEW');
          isTransitioning.current = false;
        }
      }
      // When in 'OVERVIEW', do NOT overwrite camera position so mouse wheel zoom & drag work 100% naturally!
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
      minDistance={10}
      maxDistance={320}
      maxPolarAngle={Math.PI / 2 - 0.05} // prevent clipping through ground
      minPolarAngle={Math.PI / 16}
      dampingFactor={0.06}
      enabled={!isTransitioning.current}
    />
  );
};
