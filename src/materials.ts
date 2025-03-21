import * as Three from "three";
import { OrbitControls, RGBELoader } from "three/examples/jsm/Addons.js";
import "./style.css";
import gsap from "gsap";
import GUI from "lil-gui";

const gui = new GUI();
// //Canvas
const canvas = document.getElementById("webgl") as HTMLCanvasElement;

//texture loader
const loaderManager = new Three.LoadingManager();
const textureLoader = new Three.TextureLoader(loaderManager);

//Scene
const scene = new Three.Scene();

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const colorTexture = textureLoader.load("/static/textures/door/color.jpg");
const alphaTexture = textureLoader.load("/static/textures/door/alpha.jpg");
const heightTexture = textureLoader.load("/static/textures/door/height.jpg");
const normalTexture = textureLoader.load("/static/textures/door/normal.jpg");
const metalnessTexture = textureLoader.load(
  "/static/textures/door/metalness.jpg"
);
const roughnessTexture = textureLoader.load(
  "/static/textures/door/roughness.jpg"
);
const ambientOcclusionTexture = textureLoader.load(
  "/static/textures/door/ambientOcclusion.jpg"
);

const firstMatCap = textureLoader.load("/static/textures/matcaps/1.png");
const secondMatCap = textureLoader.load("/static/textures/matcaps/2.png");

const gradientTexture = textureLoader.load("/static/textures/gradients/3.jpg");

colorTexture.colorSpace = Three.SRGBColorSpace;
firstMatCap.colorSpace = Three.SRGBColorSpace;

// secondMatCap.colorSpace = Three.SRGBColorSpace;

// colorTexture.center.set(0.5, 0.5);
// colorTexture.magFilter = Three.NearestFilter;

const geometry = new Three.BoxGeometry(1, 1, 1, 64, 64, 64);

// const material = new Three.MeshBasicMaterial({
//   side: Three.DoubleSide,
//   map: colorTexture,
// });

// material.transparent = true;
// material.opacity = 0.2;
// material.alphaMap = alphaTexture;

// const material = new Three.MeshNormalMaterial();
// material.flatShading = true;
// const material = new Three.MeshMatcapMaterial();
// material.matcap = firstMatCap;

// const material = new Three.MeshDepthMaterial();

// const ambientLight = new Three.AmbientLight(0xffffff, 0.1);
// const pointLight = new Three.PointLight(0xffffff, 2);
// pointLight.position.set(2, 1, 1);
// scene.add(pointLight);
// scene.add(ambientLight);

const rebgLoader = new RGBELoader();
rebgLoader.load("./static/textures/environmentMap/2k.hdr", (texture) => {
  texture.mapping = Three.EquirectangularReflectionMapping;
  scene.background = texture;
  scene.environment = texture;
});

// const material = new Three.MeshLambertMaterial({});

// // const material = new Three.MeshPhongMaterial();
// material.shininess = 100;
// material.specular = new Three.Color(0x1188ff);

// const material = new Three.MeshToonMaterial();

// material.gradientMap = gradientTexture;
// //becouse the image is too small it stretched so we will set the magFilter to the nearest
// gradientTexture.minFilter = Three.NearestFilter;
// gradientTexture.magFilter = Three.NearestFilter;
// gradientTexture.generateMipmaps = false;

// const material = new Three.MeshStandardMaterial();
// material.metalness = 1;
// material.roughness = 1;
// material.map = colorTexture;
// material.aoMap = ambientOcclusionTexture;
// material.aoMapIntensity = 1;
// material.displacementMap = heightTexture;
// material.metalnessMap = metalnessTexture;
// material.roughnessMap = roughnessTexture;
// material.normalMap = normalTexture;
// material.alphaMap = alphaTexture;
// material.transparent = true;
// material.side = Three.DoubleSide;
// gui.add(material, "metalness").min(0).max(1).step(0.0001);
// gui.add(material, "roughness").min(0).max(1).step(0.0001);

// material.displacementScale = 0.05;
// gui.add(material, "displacementScale").min(0).max(1).step(0.0001);

const material = new Three.MeshPhysicalMaterial();
material.metalness = 0;
material.roughness = 0;
// material.map = colorTexture;
// material.aoMap = ambientOcclusionTexture;
// material.aoMapIntensity = 1;
// material.displacementMap = heightTexture;
// material.displacementScale = 0.05;
// material.metalnessMap = metalnessTexture;
// material.roughnessMap = roughnessTexture;
// material.normalMap = normalTexture;
// material.alphaMap = alphaTexture;
// material.transparent = true;
// material.side = Three.DoubleSide;

material.transmission = 1;
material.thickness = 0.5;
material.ior = 1.5;

gui.add(material, "transmission").min(0).max(1).step(0.0001);
gui.add(material, "thickness").min(0).max(1).step(0.0001);
gui.add(material, "ior").min(1).max(2.333).step(0.0001);

// material.iridescence = 1;
// material.iridescenceIOR = 1;
// material.iridescenceThicknessRange = [100, 800];
// gui.add(material, "iridescence").min(0).max(1).step(0.0001);
// gui.add(material.iridescenceThicknessRange, "0").min(1).max(1000).step(1);
// gui.add(material.iridescenceThicknessRange, "1").min(1).max(1000).step(1);
// gui.add(material, "iridescenceIOR").min(1).max(2.333).step(0.0001);
// material.sheen = 1;
// material.sheenRoughness = 0.25;
// material.sheenColor.set(0x1188ff);
// gui.add(material, "sheenRoughness").min(0).max(1).step(0.0001);
// gui.add(material, "sheen").min(0).max(1).step(0.0001);
// gui.addColor(material, "sheenColor");
// material.clearcoat = 1;
// material.clearcoatRoughness = 0;
// gui.add(material, "clearcoatRoughness").min(0).max(1).step(0.0001);
// gui.add(material, "clearcoat").min(0).max(1).step(0.0001);
gui.add(material, "metalness").min(0).max(1).step(0.0001);
gui.add(material, "roughness").min(0).max(1).step(0.0001);

gui.add(material, "displacementScale").min(0).max(1).step(0.0001);
const mesh = new Three.Mesh(geometry, material);
const secondMesh = new Three.Mesh(
  new Three.SphereGeometry(0.5, 64, 64),
  material
);
const thirdMesh = new Three.Mesh(
  new Three.TorusGeometry(0.5, 0.25, 64, 64),
  material
);
const fourthMesh = new Three.Mesh(
  new Three.PlaneGeometry(3, 4, 64, 64),
  material
);
secondMesh.position.x = -2;
thirdMesh.position.x = 2;
fourthMesh.position.x = 4;

mesh.position.set(0, 0, 0);

mesh.rotation.y = Math.PI / 1;
// scene.add(axesHelper);
scene.add(mesh, secondMesh, thirdMesh, fourthMesh);

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

controls.target.set(0, 0, 0);
const clock = new Three.Clock();

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
  const elapsedTime = clock.getElapsedTime();
  mesh.rotation.y = elapsedTime * 0.1;
  secondMesh.rotation.y = elapsedTime * 0.1;
  thirdMesh.rotation.y = elapsedTime * 0.1;
  //   fourthMesh.rotation.y = elapsedTime * 0.1;
  mesh.rotation.x = -elapsedTime * 0.1;
  secondMesh.rotation.x = -elapsedTime * 0.1;
  thirdMesh.rotation.x = -elapsedTime * 0.1;
  //   fourthMesh.rotation.x = -elapsedTime * 0.1;
  renderer.render(scene, camera);

  window.requestAnimationFrame(renderLoop);
};
renderLoop();
