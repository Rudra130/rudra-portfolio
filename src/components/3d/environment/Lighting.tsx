import React from 'react';

export const Lighting: React.FC = () => {
  return (
    <>
      {/* Central Star Illuminator (Surya) casting dramatic sunlit vs night-side planetary contrast */}
      <pointLight position={[0, 0, 0]} intensity={28} distance={42} decay={0.95} color="#fff2d6" />

      {/* Balanced ambient space fill so dark halves of planets stay clearly visible against dust & shadows */}
      <ambientLight intensity={0.26} color="#1e293b" />

      {/* Subtle overhead & galactic core directional fill to reveal spherical planet silhouettes */}
      <directionalLight position={[12, 18, 12]} intensity={0.48} color="#e0f2fe" />
    </>
  );
};
