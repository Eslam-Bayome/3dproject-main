import * as THREE from "three";
import GUI from "lil-gui";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

/**
 * Debug
 */
const gui = new GUI();

const parameters = {
  materialColor: "#ffeded",
  objectDistance: 6,
};

gui.addColor(parameters, "materialColor").onChange(() => {
  material.color.set(parameters.materialColor);
});
//! ==========================================================================================
const textureLoader = new THREE.TextureLoader();
const gradientTexture = textureLoader.load("/static/gradients/5.jpg");
gradientTexture.magFilter = THREE.NearestFilter;
/**
 * Base
 */
// Canvas
//! ==========================================================================================

const canvas = document.getElementById("webgl") as HTMLCanvasElement;
//! ==========================================================================================

// Scene
const scene = new THREE.Scene();
//! ==========================================================================================
const gltfLoader = new GLTFLoader();
const direconalLight = new THREE.DirectionalLight(0xffffff, 1);
scene.add(direconalLight);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
let sectionMeshs: any[] = [];
gltfLoader.load(
  "/static/models/book_encyclopedia_set/book_encyclopedia_set_01_1k.gltf",
  (gltf) => {
    const model = gltf.scene;
    model.position.y = 0;
    model.position.x = 2;
    model.scale.setScalar(6);
    sectionMeshs.push(model);
    scene.add(model);
  }
);
gltfLoader.load("/static/models/chess_set/chess_set_1k.gltf", (gltf) => {
  const model = gltf.scene;
  model.position.y = -parameters.objectDistance * 1;
  model.position.x = -2;

  model.scale.setScalar(6);
  sectionMeshs.push(model);

  scene.add(model);
});
gltfLoader.load("/static/models/Ukulele/Ukulele_01_1k.gltf", (gltf) => {
  const model = gltf.scene;
  model.position.x = 2;

  model.position.y = -parameters.objectDistance * 2;
  model.scale.setScalar(6);
  sectionMeshs.push(model);

  scene.add(model);
});
const material = new THREE.MeshToonMaterial({
  color: parameters.materialColor,
  gradientMap: gradientTexture,
});

const mesh1 = new THREE.Mesh(new THREE.TorusGeometry(1, 0.4, 16, 60), material);
sectionMeshs.push(mesh1);

mesh1.position.y = -parameters.objectDistance * 3;
mesh1.position.x = -2;

scene.add(mesh1);
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
const cameraGroup = new THREE.Group();
/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  35,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 6;
cameraGroup.add(camera);
scene.add(cameraGroup);

//! ==========================================================================================

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
// renderer.setClearColor(new THREE.Color("red"), 0.5);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
//! ==========================================================================================

let scrollY = window.scrollY;
window.addEventListener("scroll", () => {
  scrollY = window.scrollY;
});

const cursor: { x: number; y: number } = {
  x: 0,
  y: 0,
};
window.addEventListener("mousemove", (event) => {
  cursor.x = event.clientX / sizes.width - 0.5;
  cursor.y = event.clientY / sizes.height - 0.5;
});
/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  camera.position.y = -(scrollY / sizes.height) * parameters.objectDistance;
  const parallaxX = cursor.x;
  const parallaxY = -cursor.y;
  cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 0.15;
  cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 0.15;

  sectionMeshs.forEach((mesh, index) => {
    mesh.rotation.x = elapsedTime * 0.1;
    mesh.rotation.y = elapsedTime * 0.15;
    mesh.rotation.z = elapsedTime * 0.05;
  });

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
