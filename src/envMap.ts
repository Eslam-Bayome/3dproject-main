import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import {
  GLTFLoader,
  GroundedSkybox,
  RGBELoader,
} from "three/examples/jsm/Addons.js";
//? Loaders
const gltfLoader = new GLTFLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();
const rgbeLoader = new RGBELoader();
//! ==========================================================================================

/**
 * Base
 */
// Debug
const gui = new GUI();
const global = {
  intensity: 1,
};

// Canvas
const canvas = document.getElementById("webgl") as HTMLCanvasElement;
//! ==========================================================================================

// Scene
const scene = new THREE.Scene();

//! ==========================================================================================

// const updateAllMaterials = () => {
//   scene.traverse((child) => {
//     if (
//       child instanceof THREE.Mesh &&
//       child.material instanceof THREE.MeshStandardMaterial
//     ) {
//       child.material.envMapIntensity = global.intensity;
//       child.material.envMap = enviromentMap;
//     }
//   });
// };
//! ==========================================================================================
// gui
//   .add(global, "intensity")
//   .min(0)
//   .max(10)
//   .step(0.001)
//   .onChange(updateAllMaterials);
// const enviromentMap = cubeTextureLoader.load([
//   "/static/environmentMap/0/px.png",
//   "/static/environmentMap/0/nx.png",
//   "/static/environmentMap/0/py.png",
//   "/static/environmentMap/0/ny.png",
//   "/static/environmentMap/0/pz.png",
//   "/static/environmentMap/0/nz.png",
// ]);
// const enviromentMap = rgbeLoader.load("/static/environmentMap/0/2k.hdr", () => {
//   enviromentMap.mapping = THREE.EquirectangularReflectionMapping;
//   scene.background = enviromentMap;
//   scene.environment = enviromentMap;
//   updateAllMaterials();
// });

// scene.backgroundIntensity = 3;
// scene.environment = enviromentMap;
// scene.background = enviromentMap;
//! ==========================================================================================

//? Ground projected Skybox

rgbeLoader.load("/static/environmentMap/0/2k.hdr", (environmentTexture) => {
  environmentTexture.mapping = THREE.EquirectangularReflectionMapping;
  const groundedSkybox = new GroundedSkybox(environmentTexture, 15, 90, 1024);
  groundedSkybox.position.y = 15;
  scene.add(groundedSkybox);
  scene.backgroundIntensity = 1;
  groundedSkybox.material.color.setScalar(50);
  scene.environment = environmentTexture;
  // scene.background = environmentTexture;
});
//! ==========================================================================================

/**
 * Torus Knot
 */
const torusKnot = new THREE.Mesh(
  new THREE.TorusKnotGeometry(1, 0.4, 100, 16),
  new THREE.MeshStandardMaterial({
    roughness: 0.3,
    metalness: 1,
    color: "#aaa",
  })
);
torusKnot.position.y = 4;
scene.add(torusKnot);
//! ==========================================================================================

gltfLoader.load(
  "/static/models/FlightHelmet/glTF/FlightHelmet.gltf",
  (gltf) => {
    gltf.scene.scale.set(10, 10, 10);
    gltf.scene.position.set(4, 0, 0);
    scene.add(gltf.scene);
    // updateAllMaterials();
  }
);

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
camera.position.set(4, 5, 4);
scene.add(camera);
//! ==========================================================================================

// Controls
const controls = new OrbitControls(camera, canvas);
controls.target.y = 3.5;
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
const tick = () => {
  // Time
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
