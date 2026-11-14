import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useUniverseStore } from '../../../store/useUniverseStore';
import { worldsData } from '../../../data/worlds';

export const CameraController: React.FC = () => {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);

  const { activeWorldId, cameraMode, setCameraMode, zoomLevel } = useUniverseStore();

  const overviewPos = useRef(new THREE.Vector3(0, 50, 115));

  useFrame((_, delta) => {
    if (activeWorldId) {
      const world = worldsData.find((w) => w.id === activeWorldId);
      if (world) {
        // Find world's approximate current position
        let targetX = 0;
        let targetZ = 0;
        if (world.orbitRadius > 0) {
          // Frame the inspected body in the left half of the screen
          targetX = world.orbitRadius * 0.7;
          targetZ = world.orbitRadius * 0.7;
        }

        const worldCenter = new THREE.Vector3(targetX, 0, targetZ);
        // Position camera to frame the planet on the left side (x offset + distance)
        const targetCam = new THREE.Vector3(
          targetX + world.cameraDistance * 0.6,
          world.cameraDistance * 0.35,
          targetZ + world.cameraDistance * 1.2
        );

        camera.position.lerp(targetCam, delta * 3.5);
        if (controlsRef.current) {
          controlsRef.current.target.lerp(worldCenter, delta * 3.5);
          controlsRef.current.update();
        }

        if (camera.position.distanceTo(targetCam) < 0.5 && cameraMode === 'APPROACHING') {
          setCameraMode('INSPECTING');
        }
      }
    } else {
      // Returning to Overview
      const currentOverview = overviewPos.current.clone().multiplyScalar(1 / zoomLevel);
      const sunCenter = new THREE.Vector3(0, 0, 0);

      camera.position.lerp(currentOverview, delta * 3.0);
      if (controlsRef.current) {
        controlsRef.current.target.lerp(sunCenter, delta * 3.0);
        controlsRef.current.update();
      }

      if (camera.position.distanceTo(currentOverview) < 1.0 && cameraMode === 'RETURNING') {
        setCameraMode('OVERVIEW');
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={true}
      enableZoom={true}
      enableRotate={true}
      minDistance={18}
      maxDistance={250}
      maxPolarAngle={Math.PI / 2 - 0.05} // prevent going underneath ground plane
      minPolarAngle={Math.PI / 12}
      dampingFactor={0.06}
      enabled={!activeWorldId} // allow free orbit when in overview
    />
  );
};
