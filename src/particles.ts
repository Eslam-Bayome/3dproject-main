import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";

/**
 * Base
 */
// Debug
const gui = new GUI();
//! ==========================================================================================

// Canvas
const canvas = document.getElementById("webgl") as HTMLCanvasElement;
//! ==========================================================================================

// Scene
const scene = new THREE.Scene();
//! ==========================================================================================

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
//! ==========================================================================================
//? particle texture
const particleTexture = textureLoader.load("/static/particles/2.png");

const paricleMaterial = new THREE.PointsMaterial({
  size: 0.2,
  sizeAttenuation: true,
  vertexColors: true,
  alphaMap: particleTexture,
  transparent: true,
  alphaTest: 0.001,
  blending: THREE.AdditiveBlending,
});
const pariclesGeomatry = new THREE.BufferGeometry();
const count = 5000;
const positions = new Float32Array(count * 3); // 3 for x, y, z
const colors = new Float32Array(count * 3); // 3 for r, g, b
// Points
for (let i = 0; i < count * 3; i++) {
  const randomX = (Math.random() - 0.5) * 15; // random number between -5 and 5
  positions[i] = randomX;
  colors[i] = Math.random(); // random number between 0 and 1
}

pariclesGeomatry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);
pariclesGeomatry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

const particles = new THREE.Points(pariclesGeomatry, paricleMaterial);
scene.add(particles);

// const particle = new THREE.Points(pariclesGeomatry, paricleMaterial);
// scene.add(particle);

//! ==========================================================================================

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
//! ==========================================================================================

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 3;
scene.add(camera);
//! ==========================================================================================

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
//! ==========================================================================================

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
//! ==========================================================================================

/**
 * Animate
 */
const clock = new THREE.Clock();
//! ==========================================================================================

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  //update particles
  //   particles.rotation.y = -elapsedTime * 0.1;
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const x = pariclesGeomatry.attributes.position.array[i3];

    pariclesGeomatry.attributes.position.array[i3 + 1] = Math.sin(
      elapsedTime + x
    );
  }
  pariclesGeomatry.attributes.position.needsUpdate = true;
  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
