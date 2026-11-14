import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { Lighting } from './environment/Lighting';
import { Starfield } from './environment/Starfield';
import { Surya } from './celestial/Surya';
import { OrbitalRings } from './celestial/OrbitalRings';
import { PlanetarySystem } from './celestial/PlanetarySystem';
import { CameraController } from './camera/CameraController';

export const CanvasContainer: React.FC = () => {
  return (
    <div className="fixed inset-0 w-full h-full z-10 bg-space-void">
      <Canvas
        camera={{ position: [0, 50, 115], fov: 45, near: 0.1, far: 1000 }}
        dpr={[1, Math.min(window.devicePixelRatio, 2)]}
        gl={{
          antialias: true,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
          powerPreference: 'high-performance',
        }}
      >
        <Suspense fallback={null}>
          <Lighting />
          <Starfield />
          <Surya />
          <OrbitalRings />
          <PlanetarySystem />
          <CameraController />
        </Suspense>
      </Canvas>
    </div>
  );
};
