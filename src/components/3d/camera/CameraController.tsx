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

  const approachStartTime = useRef<number>(0);
  const returnStartTime = useRef<number>(0);
  const destCamRef = useRef<THREE.Vector3>(new THREE.Vector3());
  const destTargetRef = useRef<THREE.Vector3>(new THREE.Vector3());

  const { activeWorldId, cameraMode, setCameraMode, zoomLevel } = useUniverseStore();

  // Overview camera: centered close framing filling viewport without bottom orbit clipping
  const overviewPos = useRef(new THREE.Vector3(0, 24.2, 5.6));
  const sunCenter = useRef(new THREE.Vector3(0, 0, 0.45));

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
      approachStartTime.current = performance.now();
      const world = worldsData.find((w) => w.id === activeWorldId);
      if (world) {
        const pos = celestialPositions[activeWorldId] || [0, 0, 0];
        const dist = world.cameraDistance;

        // Destination target: shifted right (+0.45 * dist) so the planet sits on the left ~30%
        destTargetRef.current.set(
          pos[0] + dist * 0.45,
          pos[1],
          pos[2]
        );

        // Destination camera position: elevated and in front
        destCamRef.current.set(
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
          camX: destCamRef.current.x,
          camY: destCamRef.current.y,
          camZ: destCamRef.current.z,
          tarX: destTargetRef.current.x,
          tarY: destTargetRef.current.y,
          tarZ: destTargetRef.current.z,
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
            camera.position.copy(destCamRef.current);
            if (controlsRef.current) {
              controlsRef.current.target.copy(destTargetRef.current);
              controlsRef.current.update();
            }
            approachStartTime.current = 0;
            setCameraMode('INSPECTING');
            tweenRef.current = null;
          },
        });
      }
    } else if (cameraMode === 'RETURNING') {
      returnStartTime.current = performance.now();
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
          returnStartTime.current = 0;
          setCameraMode('OVERVIEW');
          tweenRef.current = null;
        },
      });
    }
  }, [activeWorldId, cameraMode, camera, setCameraMode]);

  useFrame(() => {
    // Fail-safe frame check: ensures transition to INSPECTING completes smoothly
    if (cameraMode === 'APPROACHING' && activeWorldId && approachStartTime.current > 0) {
      const elapsed = (performance.now() - approachStartTime.current) / 1000;
      if (elapsed > 1.85 || camera.position.distanceTo(destCamRef.current) < 0.05) {
        if (tweenRef.current) {
          tweenRef.current.kill();
          tweenRef.current = null;
        }
        camera.position.copy(destCamRef.current);
        if (controlsRef.current) {
          controlsRef.current.target.copy(destTargetRef.current);
          controlsRef.current.update();
        }
        approachStartTime.current = 0;
        setCameraMode('INSPECTING');
      }
    } else if (cameraMode === 'RETURNING' && returnStartTime.current > 0) {
      const elapsed = (performance.now() - returnStartTime.current) / 1000;
      if (elapsed > 1.65 || camera.position.distanceTo(overviewPos.current) < 0.1) {
        if (tweenRef.current) {
          tweenRef.current.kill();
          tweenRef.current = null;
        }
        camera.position.copy(overviewPos.current);
        if (controlsRef.current) {
          controlsRef.current.target.copy(sunCenter.current);
          controlsRef.current.update();
        }
        returnStartTime.current = 0;
        setCameraMode('OVERVIEW');
      }
    } else if (cameraMode === 'INSPECTING' && activeWorldId) {
      // Lock target during inspection to keep the planet cleanly framed on the left
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
      target={[0, 0, 0.45]}
      enablePan={true}
      enableZoom={true}
      zoomSpeed={1.2}
      rotateSpeed={0.8}
      enableRotate={true}
      minDistance={0.8}
      maxDistance={45}
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
