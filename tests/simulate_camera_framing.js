import * as THREE from 'three';

function simulate(camPos, targetPos, ketuRadius, viewports) {
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 3500);
  camera.position.set(...camPos);
  camera.lookAt(new THREE.Vector3(...targetPos));
  camera.updateMatrixWorld();

  // Test points on Ketu's orbit (radius, eccentricity 0.085, inclination 4.2 deg)
  const incRad = (4.2 * Math.PI) / 180;
  const sqrtE = Math.sqrt(1 - 0.085 * 0.085);
  const sinInc = Math.sin(incRad);

  const points = [];
  const segments = 360;
  for (let i = 0; i < segments; i++) {
    const theta = (i / segments) * Math.PI * 2;
    points.push(new THREE.Vector3(
      ketuRadius * Math.cos(theta),
      ketuRadius * sinInc * Math.sin(theta),
      ketuRadius * sqrtE * Math.sin(theta)
    ));
  }

  console.log(`\n=== Camera: [${camPos}] Target: [${targetPos}] Ketu Radius: ${ketuRadius} ===`);

  for (const vp of viewports) {
    camera.aspect = vp.width / vp.height;
    camera.updateProjectionMatrix();

    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;

    for (const p of points) {
      const v = p.clone().project(camera);
      // v.x and v.y are in NDC [-1, 1]
      // screenX = (v.x + 1)/2 * width
      // screenY = (1 - v.y)/2 * height
      const sx = ((v.x + 1) / 2) * vp.width;
      const sy = ((1 - v.y) / 2) * vp.height;

      if (sx < minX) minX = sx;
      if (sx > maxX) maxX = sx;
      if (sy < minY) minY = sy;
      if (sy > maxY) maxY = sy;
    }

    const topMargin = minY;
    const bottomMargin = vp.height - maxY;
    const leftMargin = minX;
    const rightMargin = vp.width - maxX;

    console.log(`Viewport ${vp.width}x${vp.height}:`);
    console.log(`  Top: ${topMargin.toFixed(1)}px (minY: ${minY.toFixed(1)})`);
    console.log(`  Bottom: ${bottomMargin.toFixed(1)}px (maxY: ${maxY.toFixed(1)}) -> ${bottomMargin > 30 ? 'PASS (Clearance > 30px)' : 'FAIL (Cut off or < 30px)'}`);
    console.log(`  Left: ${leftMargin.toFixed(1)}px, Right: ${rightMargin.toFixed(1)}px`);
  }
}

const viewports = [
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 },
  { width: 1366, height: 768 },
];

// Let's test several parameter candidates
simulate([0, 680, 70], [0, 0, 20], 240, viewports);
simulate([0, 700, 60], [0, 0, 15], 240, viewports);
simulate([0, 720, 60], [0, 0, 15], 240, viewports);
