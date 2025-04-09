import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

/**
 * Loaders
 */
const gltfLoader = new GLTFLoader();
const rgbeLoader = new RGBELoader();

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.getElementById("webgl") as HTMLCanvasElement;

// Scene
const scene = new THREE.Scene();

/**
 * Update all materials
 */
const updateAllMaterials = () => {
  scene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.castShadow = true;
      child.receiveShadow = true;
      // Activzate shadow here
    }
  });
};

/**
 * Environment map
 */
// Intensity
scene.environmentIntensity = 1;
gui.add(scene, "environmentIntensity").min(0).max(10).step(0.001);

// HDR (RGBE) equirectangular
rgbeLoader.load("/static/environmentMap/0/2k.hdr", (environmentMap) => {
  environmentMap.mapping = THREE.EquirectangularReflectionMapping;

  scene.background = environmentMap;
  scene.environment = environmentMap;
});

const textureLoader = new THREE.TextureLoader();

// textureLoader.load("/static/textuers//2k.hdr", (environmentMap) => {
//   environmentMap.mapping = THREE.EquirectangularReflectionMapping;

//   scene.background = environmentMap;
//   scene.environment = environmentMap;
// });

/**
 * Models
 */
// Helmet
gltfLoader.load("static/models/hamburger.glb", (gltf) => {
  gltf.scene.scale.set(0.3, 0.3, 0.3);

  scene.add(gltf.scene);

  updateAllMaterials();
});
// gltfLoader.load("static/models/FlightHelmet/glTF/FlightHelmet.gltf", (gltf) => {
//   gltf.scene.scale.set(10, 10, 10);

//   scene.add(gltf.scene);

//   updateAllMaterials();
// });
const planeTextureColor = textureLoader.load(
  "/static/textures/castle_brick_broken_06/castle_brick_broken_06_diff_1k.jpg"
);
const planeTextureNormal = textureLoader.load(
  "/static/textures/castle_brick_broken_06/castle_brick_broken_06_nor_gl_1k.jpg"
);
const planeTextureARM = textureLoader.load(
  "/static/textures/castle_brick_broken_06/castle_brick_broken_06_arm_1k.jpg"
);

const wallTextureColor = textureLoader.load(
  "/static/textures/wood_cabinet_worn_long/wood_cabinet_worn_long_diff_1k.jpg"
);
const wallTextureNormal = textureLoader.load(
  "/static/textures/wood_cabinet_worn_long/wood_cabinet_worn_long_nor_gl_1k.jpg"
);
const wallTextureARM = textureLoader.load(
  "/static/textures/wood_cabinet_worn_long/wood_cabinet_worn_long_arm_1k.jpg"
);
wallTextureColor.colorSpace = THREE.SRGBColorSpace;
planeTextureColor.colorSpace = THREE.SRGBColorSpace;

const planeGeometry = new THREE.PlaneGeometry(10, 10, 1, 1);
const planeMaterial = new THREE.MeshStandardMaterial({
  map: planeTextureColor,
  normalMap: planeTextureNormal,
  metalnessMap: planeTextureARM,
});

const floorMaterial = new THREE.MeshStandardMaterial({
  map: wallTextureColor,
  normalMap: wallTextureNormal,
  metalnessMap: wallTextureARM,
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
const floorPlane = new THREE.Mesh(planeGeometry, floorMaterial);
plane.position.set(0, 5, -3);
floorPlane.position.set(0, 0, 2);
floorPlane.rotation.x = -Math.PI * 0.5;
scene.add(floorPlane);
scene.add(plane);

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

// Controls
const controls = new OrbitControls(camera, canvas);
controls.target.y = 3.5;
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
gui.add(renderer, "toneMapping", {
  No: THREE.NoToneMapping,
  Linear: THREE.LinearToneMapping,
  Reinhard: THREE.ReinhardToneMapping,
  Cineon: THREE.CineonToneMapping,
  ACESFilmic: THREE.ACESFilmicToneMapping,
});
gui.add(renderer, "toneMappingExposure").min(0).max(10).step(0.001);
renderer.toneMappingExposure = 1.5;
//ToneMaping
renderer.toneMapping = THREE.ReinhardToneMapping;

//light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
gui.add(directionalLight.shadow, "normalBias").min(-0.05).max(0.05).step(0.001);
gui.add(directionalLight.shadow, "bias").min(-0.05).max(0.05).step(0.001);

directionalLight.position.set(-5, 7, 3.5);
gui.add(directionalLight, "intensity").min(0).max(10).step(0.001);
gui.add(directionalLight.position, "x").min(-5).max(10).step(0.001);
gui.add(directionalLight.position, "y").min(-5).max(10).step(0.001);
gui.add(directionalLight.position, "z").min(-5).max(10).step(0.001);
directionalLight.castShadow = true;
scene.add(directionalLight);
const directionalLightCameraHelper = new THREE.CameraHelper(
  directionalLight.shadow.camera
);
directionalLight.target.position.set(0, 4, 0);
directionalLight.target.updateMatrix();
directionalLight.shadow.camera.far = 10;
directionalLight.shadow.mapSize.set(1024, 1024);

// scene.add(directionalLightCameraHelper);

/**
 * Animate
 */
const tick = () => {
  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
