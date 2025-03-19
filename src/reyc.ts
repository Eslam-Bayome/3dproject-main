import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/**
 * Base
 */
// Debug

// Canvas
const canvas = document.getElementById("webgl") as HTMLCanvasElement;
const btn = document.getElementById("btn") as HTMLDivElement;
// Scene
const scene = new THREE.Scene();

/**
 * Objects
 */
const object1 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: "#ff0000" })
);
object1.position.x = -2;

const object2 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: "#ff0000" })
);

const object3 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: "#ff0000" })
);
object3.position.x = 2;

scene.add(object1, object2, object3);

//RayCaster
// const raycaster = new THREE.Raycaster();
// const rayOrigin = new THREE.Vector3(-4, 0, 0);
// const rayDirection = new THREE.Vector3(1, 0, 0).normalize();
// raycaster.set(rayOrigin, rayDirection);
// const intersect = raycaster.intersectObject(object1);
// console.log(intersect);
// const intersects = raycaster.intersectObjects([object1, object2, object3]);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight - 200,
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

const mouse = new THREE.Vector2();
canvas.addEventListener("mousemove", (event) => {
  //clientX is the position of the mouse on the x axis with pixels
  mouse.x = (event.clientX / sizes.width) * 2 - 1;
  // the first - is becouse we need the top 1 and bottom -1
  mouse.y = -(event.clientY / sizes.height) * 2 + 1;
});

btn.addEventListener("click", () => {
  console.log("click");
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
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();
const rayOrigin = new THREE.Vector3(-4, 0, 0);
const rayDirection = new THREE.Vector3(1, 0, 0).normalize();
const testObjects = [object1, object2, object3];
const raycaster = new THREE.Raycaster(rayOrigin, rayDirection);

//Modal
const gltfLoader = new GLTFLoader();
const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  object1.position.y = Math.sin(elapsedTime) * 1.5;
  object2.position.y = Math.cos(elapsedTime * 0.3) * 1.5;
  object3.position.y = Math.sin(elapsedTime * 0.8) * 1.5;
  //
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(testObjects);
  testObjects.forEach((object) => {
    const material = (object as THREE.Mesh).material;
    if (material instanceof THREE.MeshBasicMaterial) {
      material.color.set("red");
      object.scale.set(1, 1, 1);
    }
  });
  intersects.forEach((intersect) => {
    const material = (intersect.object as THREE.Mesh).material;
    if (material instanceof THREE.MeshBasicMaterial) {
      material.color.set("blue");
    }
    intersect.object.scale.set(2, 3, 1);
  });

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();

// import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// // Canvas
// const canvas = document.getElementById("webgl") as HTMLCanvasElement;

// // Scene
// const scene = new THREE.Scene();

// // Sizes
// const sizes = {
//   width: window.innerWidth,
//   height: window.innerHeight,
// };

// // Camera
// const camera = new THREE.PerspectiveCamera(
//   75,
//   sizes.width / sizes.height,
//   0.1,
//   100
// );
// camera.position.set(0, 0, 5);
// scene.add(camera);

// // Controls
// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;

// // Raycaster for hover and click detection
// const raycaster = new THREE.Raycaster();
// const mouse = new THREE.Vector2();

// // Objects
// const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
// const material = new THREE.MeshStandardMaterial({
//   color: 0x3498db,
//   metalness: 0.3,
//   roughness: 0.4,
// });

// const sphere = new THREE.Mesh(sphereGeometry, material);
// scene.add(sphere);

// // Keep track of hovered object
// let hoveredObject: THREE.Object3D | null = null;
// let originalScale = new THREE.Vector3(1, 1, 1);

// // Lights
// const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
// scene.add(ambientLight);

// const pointLight = new THREE.PointLight(0xffffff, 0.5);
// pointLight.position.set(2, 3, 4);
// scene.add(pointLight);

// // Renderer
// const renderer = new THREE.WebGLRenderer({
//   canvas: canvas,
//   antialias: true,
// });
// renderer.setSize(sizes.width, sizes.height);
// renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// // Handle window resize
// window.addEventListener("resize", () => {
//   // Update sizes
//   sizes.width = window.innerWidth;
//   sizes.height = window.innerHeight;

//   // Update camera
//   camera.aspect = sizes.width / sizes.height;
//   camera.updateProjectionMatrix();

//   // Update renderer
//   renderer.setSize(sizes.width, sizes.height);
//   renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// });

// // Mouse move event for hover
// window.addEventListener("mousemove", (event) => {
//   // Convert mouse position to normalized device coordinates
//   mouse.x = (event.clientX / sizes.width) * 2 - 1;
//   mouse.y = -(event.clientY / sizes.height) * 2 + 1;
// });

// // Mouse click event
// window.addEventListener("click", () => {
//   // Update the picking ray with the camera and mouse position
//   raycaster.setFromCamera(mouse, camera);

//   // Calculate objects intersecting the picking ray
//   const intersects = raycaster.intersectObjects([sphere]);

//   if (intersects.length > 0) {
//     const clickedObject = intersects[0].object;

//     // Create a new cube at position of sphere + 1 on x-axis
//     const cubeGeometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
//     const cubeMaterial = new THREE.MeshStandardMaterial({
//       color: 0xe74c3c,
//       metalness: 0.3,
//       roughness: 0.4,
//     });

//     const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

//     // Copy the position of the clicked object and add 2 to the x coordinate
//     const newPosition = clickedObject.position.clone();
//     newPosition.x += 2;

//     cube.position.copy(newPosition);

//     // Add the cube to the scene
//     scene.add(cube);
//   }
// });

// // Animation loop
// const tick = () => {
//   // Update the raycaster
//   raycaster.setFromCamera(mouse, camera);

//   // Check for hover interactions
//   const intersects = raycaster.intersectObjects([sphere]);

//   // Handle hover states
//   if (intersects.length > 0) {
//     const hoveredMesh = intersects[0].object as THREE.Mesh;

//     if (hoveredObject !== hoveredMesh) {
//       // New hover
//       if (hoveredObject) {
//         // Reset previous hovered object
//         hoveredObject.scale.copy(originalScale);
//       }

//       // Store the current scale before modifying
//       originalScale.copy(hoveredMesh.scale);

//       // Store the currently hovered object
//       hoveredObject = hoveredMesh;
//     }

//     // Scale up the hovered object
//     hoveredObject.scale.set(1.2, 1.2, 1.2);
//   } else if (hoveredObject) {
//     // No intersection but we had a hovered object before
//     hoveredObject.scale.copy(originalScale);
//     hoveredObject = null;
//   }

//   // Update controls
//   controls.update();

//   // Render
//   renderer.render(scene, camera);

//   // Call tick again on the next frame
//   window.requestAnimationFrame(tick);
// };

// tick();
