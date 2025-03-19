import * as Three from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import "./style.css";
//Canvas
const canvas = document.getElementById("webgl") as HTMLCanvasElement;

//Scene
const scene = new Three.Scene();

//Axes Helper
const axesHelper = new Three.AxesHelper(3);
//Object

//Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

//width , height , depth
const geometry = new Three.BoxGeometry(1, 1, 1);

const material = new Three.MeshBasicMaterial({ color: "red" });
// Mesh competiation of geometry and material
const mesh = new Three.Mesh(geometry, material);
// mesh.position.x = -0.7;
mesh.position.set(-0.7, -0.6, 1);

//Scale
// mesh.scale.x = 2;
// mesh.scale.y = 0.1;
// mesh.scale.z = 3;

//Rotaion
mesh.rotation.reorder("YXZ");

mesh.rotation.y = Math.PI / 1;
// mesh.rotation.x = Math.PI / 4;
scene.add(axesHelper);
scene.add(mesh);

console.log(mesh.position.length());

//Camera
//usually the field of view is 35 degrees it is the angle of the camera
const camera = new Three.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
// camera.position.x = 3;
// camera.position.y = 1;
// camera.lookAt(mesh.position);
// it is optional but it might provide bugs if u didnt provide it
scene.add(camera);

const renderer = new Three.WebGLRenderer({
  canvas,
});

renderer.setSize(sizes.width, sizes.height);

// console.log(mesh.position.distanceTo(camera.position));

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.autoRotate = true;
controls.target.set(-0.7, -0.6, 1); // Set the orbit target to the mesh position

// //requestAnimationFrame
let time = Date.now();
const clock = new Three.Clock();
const renderLoop = () => {
  let currentTime = Date.now();
  let deltaTime = currentTime - time;
  time = currentTime;
  // controls.update();
  // mesh.position.x += 0.01 * deltaTime;
  mesh.rotation.y += 0.001 * deltaTime;
  mesh.position.x = Math.sin(clock.getElapsedTime() * 2 * Math.PI);
  renderer.render(scene, camera);
  window.requestAnimationFrame(renderLoop);
};
renderLoop();

// renderer.render(scene, camera);

// const group = new Three.Group();
// const cube1 = new Three.Mesh(
//   new Three.BoxGeometry(1, 1, 1),
//   new Three.MeshBasicMaterial({ color: "red" })
// );
// const cube2 = new Three.Mesh(
//   new Three.BoxGeometry(2, 1, 1),
//   new Three.MeshBasicMaterial({ color: "green" })
// );
// const cube3 = new Three.Mesh(
//   new Three.BoxGeometry(2, 1, 1),
//   new Three.MeshBasicMaterial({ color: "white" })
// );
// cube2.position.y = 1;
// cube3.position.x = 3;
// group.scale.set(0.3, 1, 1);
// group.add(cube1);
// group.add(cube2);
// group.add(cube3);
// scene.add(group);
