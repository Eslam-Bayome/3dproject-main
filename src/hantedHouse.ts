import * as Three from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Timer } from "three/addons/misc/Timer.js";
import GUI from "lil-gui";
import { Sky } from "three/addons/objects/Sky.js";

/**
 * Base
 */
// Debug
const gui = new GUI();
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

// Canvas
const canvas = document.getElementById("webgl") as HTMLCanvasElement;
//! ==========================================================================================

// Scene
const scene = new Three.Scene();
//! ==========================================================================================

/**
 * Camera
 */
// Base camera
const camera = new Three.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 5;
scene.add(camera);
//! ==========================================================================================

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

//! ==========================================================================================
//* Textures
const textureLoader = new Three.TextureLoader();

const floorAlphaTexture = textureLoader.load("public/static/floor/alpha.jpg");

const floorColorTexture = textureLoader.load(
  "public/static/floor/rocky_diff.jpg"
);
const floorNormalTexture = textureLoader.load(
  "public/static/floor/rocky_gl.jpg"
);

const armTexture = textureLoader.load("public/static/floor/rocky_arm.jpg");

const displacementTexture = textureLoader.load(
  "public/static/floor/rocky_disp.png"
);

//? walls

const wallColorTexture = textureLoader.load(
  "public/static/wall/patterned_diff.jpg"
);
const wallArmTexture = textureLoader.load(
  "public/static/wall/patterned_arm.jpg"
);
const wallNormalTexture = textureLoader.load(
  "public/static/wall/patterned_gl.jpg"
);

//? roofs

const roofColorTexture = textureLoader.load(
  "public/static/roof/ceramic_diff.jpg"
);
const roofArmTexture = textureLoader.load("public/static/roof/ceramic_arm.jpg");
const roofNormalTexture = textureLoader.load(
  "public/static/roof/ceramic_gl.jpg"
);
const bushesColorTexture = textureLoader.load(
  "public/static/bushes/granite_diff.jpg"
);
const bushesArmTexture = textureLoader.load(
  "public/static/bushes/granite_arm.jpg"
);
const bushesNormalTexture = textureLoader.load(
  "public/static/bushes/granite_gl.jpg"
);

const graveColorTexture = textureLoader.load(
  "public/static/grave/tile_diff.jpg"
);
const graveArmTexture = textureLoader.load("public/static/grave/tile_arm.jpg");
const graveNormalTexture = textureLoader.load(
  "public/static/grave/tile_gl.jpg"
);

// const doorAlphaTexture = textureLoader.load("public/static/door/alpha.jpg");

const doorColorTexture = textureLoader.load("public/static/door/door_diff.jpg");
const doorNormalTexture = textureLoader.load("public/static/door/door_gl.jpg");

const doorArmTexture = textureLoader.load("public/static/door/door_arm.jpg");

const doorDisplacementTexture = textureLoader.load(
  "public/static/door/door_disp.jpg"
);
//for only the color textuyre we have to inform threejs  to make colors better by settingthe color space of the texture to three.srgbColorSpace
floorColorTexture.colorSpace = Three.SRGBColorSpace;
wallColorTexture.colorSpace = Three.SRGBColorSpace;
roofColorTexture.colorSpace = Three.SRGBColorSpace;
bushesColorTexture.colorSpace = Three.SRGBColorSpace;
graveColorTexture.colorSpace = Three.SRGBColorSpace;
doorColorTexture.colorSpace = Three.SRGBColorSpace;
//! ==========================================================================================

floorColorTexture.repeat.set(6, 6);
floorColorTexture.wrapS = Three.RepeatWrapping;
floorColorTexture.wrapT = Three.RepeatWrapping;

floorNormalTexture.repeat.set(6, 6);
floorNormalTexture.wrapS = Three.RepeatWrapping;
floorNormalTexture.wrapT = Three.RepeatWrapping;

armTexture.repeat.set(6, 6);
armTexture.wrapS = Three.RepeatWrapping;
armTexture.wrapT = Three.RepeatWrapping;

displacementTexture.repeat.set(6, 6);
displacementTexture.wrapS = Three.RepeatWrapping;
displacementTexture.wrapT = Three.RepeatWrapping;

//! roof repeated
roofColorTexture.repeat.set(4, 1);
roofColorTexture.wrapS = Three.RepeatWrapping;
roofColorTexture.wrapT = Three.RepeatWrapping;

roofNormalTexture.repeat.set(4, 1);
roofNormalTexture.wrapS = Three.RepeatWrapping;
roofNormalTexture.wrapT = Three.RepeatWrapping;

roofArmTexture.repeat.set(4, 1);
roofArmTexture.wrapS = Three.RepeatWrapping;
roofArmTexture.wrapT = Three.RepeatWrapping;

bushesColorTexture.repeat.set(2, 1);
bushesColorTexture.wrapS = Three.RepeatWrapping;
bushesColorTexture.wrapT = Three.RepeatWrapping;

bushesNormalTexture.repeat.set(2, 1);
bushesNormalTexture.wrapS = Three.RepeatWrapping;
bushesNormalTexture.wrapT = Three.RepeatWrapping;

bushesArmTexture.repeat.set(2, 1);
bushesArmTexture.wrapS = Three.RepeatWrapping;
bushesArmTexture.wrapT = Three.RepeatWrapping;

graveColorTexture.repeat.set(4, 1);
graveColorTexture.wrapS = Three.RepeatWrapping;
graveColorTexture.wrapT = Three.RepeatWrapping;

graveNormalTexture.repeat.set(4, 1);
graveNormalTexture.wrapS = Three.RepeatWrapping;
graveNormalTexture.wrapT = Three.RepeatWrapping;
graveArmTexture.repeat.set(4, 1);
graveArmTexture.wrapS = Three.RepeatWrapping;
graveArmTexture.wrapT = Three.RepeatWrapping;
//! ==========================================================================================
/**
 //?House
 */
//*  when we use displacment map we have to increaes the verices of the geometry we use
//*  to get a better result and also we control the displacment scale so it didnnt go to mush up
//Floor
const floor = new Three.Mesh(
  new Three.PlaneGeometry(20, 20, 100, 100),
  new Three.MeshStandardMaterial({
    alphaMap: floorAlphaTexture,
    transparent: true,
    map: floorColorTexture,
    aoMap: armTexture,
    roughnessMap: armTexture,
    metalnessMap: armTexture,
    normalMap: floorNormalTexture,
    displacementMap: displacementTexture,
    displacementScale: 0.5,
    displacementBias: -0.15,
    // side: Three.DoubleSide,
  })
);
// console.log(floor.material);
gui.add(floor.material, "displacementScale", 0, 1, 0.001).name("displacement");
gui
  .add(floor.material, "displacementBias", -1, 1, 0.001)
  .name("displacementBias");

floor.rotation.x = -Math.PI * 0.5;
floor.position.y = -0.1;
scene.add(floor);

//we create group for the house
const house = new Three.Group();
scene.add(house);
//walls
const wallHeight = 2.5;
const walls = new Three.Mesh(
  new Three.BoxGeometry(4, wallHeight, 4),
  new Three.MeshStandardMaterial({
    map: wallColorTexture,
    aoMap: wallArmTexture,
    roughnessMap: wallArmTexture,
    normalMap: wallNormalTexture,
    metalnessMap: wallArmTexture,
  })
);
walls.position.y += wallHeight / 2;
house.add(walls);
const roofHeight = 1.5;
const roof = new Three.Mesh(
  new Three.ConeGeometry(4, roofHeight, 4),
  new Three.MeshStandardMaterial({
    map: roofColorTexture,
    aoMap: roofArmTexture,
    roughnessMap: roofArmTexture,
    metalnessMap: roofArmTexture,
    normalMap: roofNormalTexture,
  })
);

roof.rotation.y = -Math.PI * 0.25;

// gui.add(roof.rotation, "y", -Math.PI, Math.PI);

roof.position.y = wallHeight + roofHeight / 2;
house.add(roof);

//door
const door = new Three.Mesh(
  new Three.PlaneGeometry(2.2, 2.2, 50, 50),
  new Three.MeshStandardMaterial({
    color: "white",
    map: doorColorTexture,
    aoMap: doorArmTexture,
    roughnessMap: doorArmTexture,
    normalMap: doorNormalTexture,
    metalnessMap: doorArmTexture,
    displacementMap: doorDisplacementTexture,
    displacementScale: 0.3,
    displacementBias: -0.11,
  })
);
door.position.y = 1;
door.position.z = 2 + 0.01;
house.add(door);
//Bushes
const bushGeomatery = new Three.SphereGeometry(1, 16, 16);
const bushMaterial = new Three.MeshStandardMaterial({
  map: bushesColorTexture,
  aoMap: bushesArmTexture,
  roughnessMap: bushesArmTexture,
  normalMap: bushesNormalTexture,
  metalnessMap: bushesArmTexture,
});
const bush1 = new Three.Mesh(bushGeomatery, bushMaterial);
const bush2 = new Three.Mesh(bushGeomatery, bushMaterial);

const bush3 = new Three.Mesh(bushGeomatery, bushMaterial);
const bush4 = new Three.Mesh(bushGeomatery, bushMaterial);
// bush1.material.color.set("#ccffcc");

bush1.scale.set(0.5, 0.5, 0.5);
bush2.scale.set(0.25, 0.25, 0.25);
bush3.scale.set(0.25, 0.25, 0.25);
bush4.scale.set(0.15, 0.15, 0.15);

bush1.position.set(0.8, 0.2, 2.2);
bush2.position.set(1.4, 0.1, 2.1);
bush3.position.set(-0.8, 0.1, 2.2);
bush4.position.set(-1, 0.05, 2.6);

bush1.rotation.x = -0.15;
bush2.rotation.x = -0.15;
bush3.rotation.x = -0.15;
bush4.rotation.x = -0.15;

house.add(bush1, bush2, bush3, bush4);

//Graves

const graveGeomatry = new Three.BoxGeometry(0.6, 0.8, 0.2);
const graveMaterial = new Three.MeshStandardMaterial({
  map: graveColorTexture,
  aoMap: graveArmTexture,
  roughnessMap: graveArmTexture,
  normalMap: graveNormalTexture,
  metalnessMap: graveArmTexture,
});
const graveGroups = new Three.Group();
for (let i = 0; i < 30; i++) {
  const angle = Math.PI * 2 * Math.random();
  const minDistance = 3; // add a little margin
  const maxDistance = 7; // also keep a bit inside plane edges
  const distance = minDistance + Math.random() * (maxDistance - minDistance);
  const grave = new Three.Mesh(graveGeomatry, graveMaterial);
  grave.position.x = Math.cos(angle) * distance;
  grave.position.z = Math.sin(angle) * distance;
  grave.position.y = Math.random() * 0.3;
  grave.rotation.x = (Math.random() - 0.5) * 0.2;
  grave.rotation.y = (Math.random() - 0.5) * 0.3;
  grave.rotation.z = (Math.random() - 0.5) * 0.3;
  graveGroups.add(grave);
}

scene.add(graveGroups);
//! ==========================================================================================

/**
 //*Lights
 */
// Ambient light
//!86cdff like moon light
const ambientLight = new Three.AmbientLight("#86cdff", 0.275);
scene.add(ambientLight);

// Directional light
const directionalLight = new Three.DirectionalLight("#86cdff", 1);
directionalLight.position.set(3, 2, -8);
scene.add(directionalLight);

//? door light
const doorLight = new Three.PointLight("ff7d45", 5);
doorLight.position.set(0, 2.2, 2.5);
scene.add(doorLight);

//? Ghost Light
const ghost1 = new Three.PointLight("#8800ff", 6);
const ghost2 = new Three.PointLight("#ff0088", 6);
const ghost3 = new Three.PointLight("#ff0000", 6);
scene.add(ghost1, ghost2, ghost3);
//! ==========================================================================================
//? sky

const sky = new Sky();
scene.add(sky);
sky.scale.setScalar(200);
sky.material.uniforms["turbidity"].value = 10;
sky.material.uniforms["rayleigh"].value = 3;
sky.material.uniforms["mieCoefficient"].value = 0.1;
sky.material.uniforms["mieDirectionalG"].value = 0.95;
sky.material.uniforms["sunPosition"].value.set(0.3, -0.038, -0.95);
//! ==========================================================================================

//? fog

// scene.fog = new Three.Fog("#262837", 4, 15);
scene.fog = new Three.FogExp2("#02343f", 0.08);
//! =========================================================================================

/**
 * Renderer
 */
const renderer = new Three.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
//! ==========================================================================================
//? Shadows
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = Three.PCFSoftShadowMap;
directionalLight.castShadow = true;
ghost1.castShadow = true;
ghost2.castShadow = true;
ghost3.castShadow = true;

walls.castShadow = true;
walls.receiveShadow = true;

roof.castShadow = true;
roof.receiveShadow = true;

floor.receiveShadow = true;

graveGroups.children.forEach((grave) => {
  grave.receiveShadow = true;
  grave.castShadow = true;
});

//? mapping the shadows
directionalLight.shadow.mapSize.width = 256;
directionalLight.shadow.mapSize.height = 256;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 20; //  default is 500
directionalLight.shadow.camera.left = -8;
directionalLight.shadow.camera.right = 8;
directionalLight.shadow.camera.top = 8;
directionalLight.shadow.camera.bottom = -8;

ghost1.shadow.mapSize.width = 256;
ghost1.shadow.mapSize.height = 256;
ghost1.shadow.camera.near = 1;
ghost1.shadow.camera.far = 10;

ghost2.shadow.mapSize.width = 256;
ghost2.shadow.mapSize.height = 256;
ghost2.shadow.camera.near = 1;
ghost2.shadow.camera.far = 10;

ghost3.shadow.mapSize.width = 256;
ghost3.shadow.mapSize.height = 256;
ghost3.shadow.camera.near = 1;
ghost3.shadow.camera.far = 10;
//! ==========================================================================================

/**
 * Animate
 */
const timer = new Timer();

const tick = () => {
  // Timer
  timer.update();
  const elapsedTime = timer.getElapsed();

  //Ghost
  const ghost1Angle = elapsedTime * 0.25;
  const ghost3Angle = -elapsedTime * 0.45;
  const ghost2Angle = elapsedTime * 0.7;
  ghost1.position.x = Math.cos(ghost1Angle) * 8;
  ghost1.position.z = Math.sin(ghost1Angle) * 4;
  ghost1.position.y =
    Math.sin(ghost1Angle * 2.43) *
    Math.sin(ghost1Angle * 3.45) *
    Math.sin(ghost1Angle);

  ghost2.position.x = Math.cos(ghost2Angle) * 3;
  ghost2.position.z = Math.sin(ghost2Angle) * 10;
  ghost2.position.y =
    Math.sin(ghost1Angle * 1.43) *
    Math.sin(ghost1Angle * 6.45) *
    Math.sin(ghost1Angle);

  ghost3.position.x = Math.cos(ghost3Angle) * 7;
  ghost3.position.z = Math.sin(ghost3Angle) * 3;
  ghost3.position.y =
    Math.sin(ghost1Angle * 5.43) *
    Math.sin(ghost1Angle * -2.45) *
    Math.sin(ghost1Angle);

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
