import React from 'react';

export const Lighting: React.FC = () => {
  return (
    <>
      {/* Central Star Illuminator (Surya) casting dramatic sunlit vs night-side planetary contrast */}
      <pointLight position={[0, 0, 0]} intensity={26} distance={38} decay={1.05} color="#fff0d4" />

      {/* Subtle deep space fill so planet night sides keep faint silhouette relief */}
      <ambientLight intensity={0.11} color="#0f172a" />

      {/* Subtle cool galactic core fill */}
      <directionalLight position={[15, 10, 12]} intensity={0.22} color="#e0f2fe" />
    </>
  );
};
