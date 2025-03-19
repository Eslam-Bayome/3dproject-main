import * as Three from "three";
import { GLTFLoader, OrbitControls } from "three/examples/jsm/Addons.js";
import "./style.css";

//Canvas
const canvas = document.getElementById("webgl") as HTMLCanvasElement;

//Scene
const scene = new Three.Scene();

//Axes Helper
const axesHelper = new Three.AxesHelper(3);

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const geometry = new Three.BoxGeometry(1, 1, 1);

const material = new Three.MeshBasicMaterial({ color: "red" });

const mesh = new Three.Mesh(geometry, material);

mesh.position.set(0.41, 0, 1);

mesh.rotation.y = Math.PI / 1;
// scene.add(axesHelper);
scene.add(mesh);

console.log(mesh.position.length());

//Camera
const camera = new Three.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;

// camera.lookAt(mesh.position);

scene.add(camera);

const renderer = new Three.WebGLRenderer({
  canvas,
});

renderer.setSize(sizes.width, sizes.height);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.autoRotate = true;
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
const renderLoop = () => {
  // let currentTime = Date.now();
  // let deltaTime = currentTime - time;
  // time = currentTime;
  // // controls.update();

  // mesh.rotation.y += 0.001 * deltaTime;
  mesh.rotation.x = Math.sin(clock.getElapsedTime() * 2 * Math.PI);
  renderer.render(scene, camera);
  window.requestAnimationFrame(renderLoop);
};
renderLoop();
