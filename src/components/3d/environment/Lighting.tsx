import React from 'react';

export const Lighting: React.FC = () => {
  return (
    <>
      {/* Central Star Illuminator (Surya) casting vivid sunlit crescents across all planets */}
      <pointLight position={[0, 0, 0]} intensity={32} distance={48} decay={0.9} color="#fff2d6" />

      {/* Balanced ambient fill keeping every planet crystal clear over dense cosmic dust */}
      <ambientLight intensity={0.3} color="#1e293b" />

      {/* Crisp overhead rim fill to separate 3D spheres from dust backdrop */}
      <directionalLight position={[12, 20, 12]} intensity={0.55} color="#e0f2fe" />
    </>
  );
};
