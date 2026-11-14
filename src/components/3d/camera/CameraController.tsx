import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { useUniverseStore } from '../../../store/useUniverseStore';
import { worldsData } from '../../../data/worlds';
import { celestialPositions } from '../celestial/PlanetarySystem';

export const CameraController: React.FC = () => {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

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

  // GSAP Camera Choreography on planet selection or return
  useEffect(() => {
    if (tweenRef.current) {
      tweenRef.current.kill();
      tweenRef.current = null;
    }

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (activeWorldId && cameraMode === 'APPROACHING') {
      const world = worldsData.find((w) => w.id === activeWorldId);
      if (world) {
        const pos = celestialPositions[activeWorldId] || [0, 0, 0];
        const dist = world.cameraDistance;

        // Destination target: shifted right (+0.45 * dist) so the planet sits on the left ~30%
        const destTarget = new THREE.Vector3(
          pos[0] + dist * 0.45,
          pos[1],
          pos[2]
        );

        // Destination camera position: elevated and in front
        const destCam = new THREE.Vector3(
          pos[0] + dist * 0.40,
          pos[1] + dist * 0.12,
          pos[2] + dist * 1.15
        );

        const proxy = {
          camX: camera.position.x,
          camY: camera.position.y,
          camZ: camera.position.z,
          tarX: controlsRef.current ? controlsRef.current.target.x : 0,
          tarY: controlsRef.current ? controlsRef.current.target.y : 0,
          tarZ: controlsRef.current ? controlsRef.current.target.z : 0,
        };

        const duration = prefersReduced ? 0.05 : 1.7;

        tweenRef.current = gsap.to(proxy, {
          camX: destCam.x,
          camY: destCam.y,
          camZ: destCam.z,
          tarX: destTarget.x,
          tarY: destTarget.y,
          tarZ: destTarget.z,
          duration,
          ease: 'power3.inOut',
          onUpdate: () => {
            camera.position.set(proxy.camX, proxy.camY, proxy.camZ);
            if (controlsRef.current) {
              controlsRef.current.target.set(proxy.tarX, proxy.tarY, proxy.tarZ);
              controlsRef.current.update();
            }
          },
          onComplete: () => {
            setCameraMode('INSPECTING');
            tweenRef.current = null;
          },
        });
      }
    } else if (cameraMode === 'RETURNING') {
      const proxy = {
        camX: camera.position.x,
        camY: camera.position.y,
        camZ: camera.position.z,
        tarX: controlsRef.current ? controlsRef.current.target.x : 0,
        tarY: controlsRef.current ? controlsRef.current.target.y : 0,
        tarZ: controlsRef.current ? controlsRef.current.target.z : 0,
      };

      const duration = prefersReduced ? 0.05 : 1.5;

      tweenRef.current = gsap.to(proxy, {
        camX: overviewPos.current.x,
        camY: overviewPos.current.y,
        camZ: overviewPos.current.z,
        tarX: sunCenter.current.x,
        tarY: sunCenter.current.y,
        tarZ: sunCenter.current.z,
        duration,
        ease: 'power2.out',
        onUpdate: () => {
          camera.position.set(proxy.camX, proxy.camY, proxy.camZ);
          if (controlsRef.current) {
            controlsRef.current.target.set(proxy.tarX, proxy.tarY, proxy.tarZ);
            controlsRef.current.update();
          }
        },
        onComplete: () => {
          camera.position.copy(overviewPos.current);
          if (controlsRef.current) {
            controlsRef.current.target.copy(sunCenter.current);
            controlsRef.current.update();
          }
          setCameraMode('OVERVIEW');
          tweenRef.current = null;
        },
      });
    }

    return () => {
      if (tweenRef.current) {
        tweenRef.current.kill();
        tweenRef.current = null;
      }
    };
  }, [activeWorldId, cameraMode, camera, setCameraMode]);

  useFrame(() => {
    // Lock target during inspection to keep the planet cleanly framed on the left
    if (cameraMode === 'INSPECTING' && activeWorldId) {
      const world = worldsData.find((w) => w.id === activeWorldId);
      if (world && controlsRef.current) {
        const pos = celestialPositions[activeWorldId] || [0, 0, 0];
        const dist = world.cameraDistance;
        controlsRef.current.target.set(
          pos[0] + dist * 0.45,
          pos[1],
          pos[2]
        );
      }
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
      enableDamping={true}
      dampingFactor={0.06}
      touches={{
        ONE: THREE.TOUCH.ROTATE,
        TWO: THREE.TOUCH.DOLLY_PAN,
      }}
      enabled={cameraMode === 'OVERVIEW'}
    />
  );
};
