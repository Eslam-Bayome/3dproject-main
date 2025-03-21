import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import GUI from "lil-gui";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

const fontLoader = new FontLoader();
fontLoader.load("/static/fonts/helvetiker_regular.typeface.json", (font) => {
  const textGeomatry = new TextGeometry("Hello Iam Bayome", {
    font: font,
    size: 0.5,
    depth: 0.2,
    curveSegments: 6,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 4,
  });
  textGeomatry.computeBoundingBox();
  textGeomatry.center();
  /**
   * Base
   */
  // Debug
  const gui = new GUI();

  // Canvas
  const canvas = document.getElementById("webgl") as HTMLCanvasElement;
  /**
   * Textures
   */
  const textureLoader = new THREE.TextureLoader();
  const mapcapTexture = textureLoader.load("/static/textures/matcaps/1.png");
  const mapcapTexture4 = textureLoader.load("/static/textures/matcaps/8.png");
  const mapcapTexture3 = textureLoader.load("/static/textures/matcaps/3.png");
  const mapcapTexture5 = textureLoader.load("/static/textures/matcaps/5.png");
  /**
   * Object
   */
  const textMesh = new THREE.Mesh(
    textGeomatry,
    new THREE.MeshMatcapMaterial({
      matcap: mapcapTexture,
    })
  );
  // Scene
  const scene = new THREE.Scene();
  scene.add(textMesh);
  const axixHelper = new THREE.AxesHelper(1);
  //   scene.add(axixHelper);

  const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial()
  );
  const dountGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);
  const dountMaterial1 = new THREE.MeshMatcapMaterial({
    matcap: mapcapTexture5,
  });
  const dountMateria2 = new THREE.MeshMatcapMaterial({
    matcap: mapcapTexture4,
  });

  const dountMateria3 = new THREE.MeshMatcapMaterial({
    matcap: mapcapTexture3,
  });
  //   scene.add(cube);
  for (let i = 0; i < 100; i++) {
    const dountMaterial =
      i % 3 === 0
        ? dountMaterial1
        : i % 3 === 1
        ? dountMateria2
        : dountMateria3;
    const dount = new THREE.Mesh(dountGeometry, dountMaterial);
    dount.position.x = (Math.random() - 0.5) * 15;
    dount.position.y = (Math.random() - 0.5) * 15;
    dount.position.z = (Math.random() - 0.5) * 15;
    dount.rotation.x = Math.random() * Math.PI;
    dount.rotation.y = Math.random() * Math.PI;
    const randomScale = Math.random() * 2;
    dount.scale.set(randomScale, randomScale, randomScale);
    scene.add(dount);
  }
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
  camera.position.x = 1;
  camera.position.y = 1;
  camera.position.z = 2;
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

  const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
  };

  tick();
});
