import React from 'react';

export const Lighting: React.FC = () => {
  return (
    <>
      {/* Central Star Illuminator (Surya) */}
      <pointLight position={[0, 0, 0]} intensity={18} distance={30} decay={1.2} color="#ffedd5" />

      {/* Deep space ambient fill so the dark sides of planets retain subtle texture relief */}
      <ambientLight intensity={0.22} color="#0f172a" />

      {/* Distant galactic core directional light */}
      <directionalLight position={[15, 10, 12]} intensity={0.5} color="#e0f2fe" />
    </>
  );
};
