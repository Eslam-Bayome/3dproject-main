import * as Three from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import "./style.css";
import gsap from "gsap";
// import normalTexture from "public/static/textures/door/normal.jpg";
// import alphaTexture from "public/static/textures/door/alpha.jpg";
// //Canvas
const canvas = document.getElementById("webgl") as HTMLCanvasElement;

//texture loader
const loaderManager = new Three.LoadingManager();
const textureLoader = new Three.TextureLoader(loaderManager);

//Scene
const scene = new Three.Scene();

//Axes Helper
const axesHelper = new Three.AxesHelper(3);

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const colorTexture = textureLoader.load("/static/textures/door/color.jpg");
const alphaTexture = textureLoader.load("/static/textures/door/alpha.jpg");
const heightTexture = textureLoader.load("/static/textures/door/height.jpg");
const metalnessTexture = textureLoader.load(
  "/static/textures/door/metalness.jpg"
);
const normalTexture = textureLoader.load(
  "/static/textures/door/normalTexture.jpg"
);
const ambientOcclusionTexture = textureLoader.load(
  "/static/textures/door/ambientOcclusion.jpg"
);

const geometry = new Three.BoxGeometry(1, 1, 1, 4, 4, 4);
// const positionsArray = new Float32Array([0, 0, 0, 0, 1, 0, 1, 0, 0]);
// const positionsAttribute = new Three.BufferAttribute(positionsArray, 3);
// const secendGeometry = new Three.BufferGeometry();
// secendGeometry.setAttribute("position", positionsAttribute);

// const thiredGeo = new Three.BufferGeometry();
// const count = 5000;
// const arrays = new Float32Array(count * 3 * 3);

// for (let i = 0; i < count * 3 * 3; i++) {
//   arrays[i] = (Math.random() - 0.5) * Math.min(i, 100);
// }

// const buffered = new Three.BufferAttribute(arrays, 3);
// thiredGeo.setAttribute("position", buffered);

const material = new Three.MeshBasicMaterial({ map: colorTexture });

const mesh = new Three.Mesh(geometry, material);

mesh.position.set(0.41, 0, 1);

mesh.rotation.y = Math.PI / 1;
// scene.add(axesHelper);
scene.add(mesh);

//Camera
const camera = new Three.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;

// camera.lookAt(mesh.position);

scene.add(camera);

const renderer = new Three.WebGLRenderer({
  canvas,
  antialias: true,
});

renderer.setSize(sizes.width, sizes.height);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
// controls.autoRotate = true;
controls.target.set(0.41, 0, 1);

// let time = Date.now();
const clock = new Three.Clock();
// gsap.to(mesh.position, {
//   x: 2,
//   duration: 1,
//   delay: 2,
// });
// gsap.to(mesh.position, {
//   x: -2,
//   duration: 1,
//   delay: 4,
// });
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
});
const maxPixelRation = Math.min(2, window.devicePixelRatio);
renderer.setPixelRatio(maxPixelRation);
const renderLoop = () => {
  // let currentTime = Date.now();
  // let deltaTime = currentTime - time;
  // time = currentTime;
  // // controls.update();

  // mesh.rotation.y += 0.001 * deltaTime;
  // mesh.rotation.x = Math.sin(clock.getElapsedTime() * 2 * Math.PI);
  renderer.render(scene, camera);
  window.requestAnimationFrame(renderLoop);
};
renderLoop();
