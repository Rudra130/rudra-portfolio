import React from 'react';

export const Lighting: React.FC = () => {
  return (
    <>
      {/* Central Star Illuminator (Surya) */}
      <pointLight position={[0, 0, 0]} intensity={350} distance={250} decay={1.8} color="#ffedd5" />

      {/* Deep space ambient fill so the dark sides of planets retain subtle texture relief */}
      <ambientLight intensity={0.18} color="#0f172a" />

      {/* Distant galactic core directional light */}
      <directionalLight position={[100, 60, 80]} intensity={0.4} color="#e0f2fe" />
    </>
  );
};
