import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const generateBalls = ({ length }: { length: number }) => {
  return new Array(length).fill(0).map((_, i) => {
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 16, 16),
      new THREE.MeshBasicMaterial({ color: "#ff0000" })
    );
    mesh.position.x = i % 2 === 0 ? -i : i;
    return mesh;
  });
};
const genericBalls = () => {
  const canvas = document.getElementById("webgl") as HTMLCanvasElement;
  const btn = document.getElementById("btn") as HTMLDivElement;
  const scene = new THREE.Scene();

  const meshs = generateBalls({ length: 10 });

  scene.add(...meshs);

  //RayCaster
  // const raycaster = new THREE.Raycaster();
  // const rayOrigin = new THREE.Vector3(-4, 0, 0);
  // const rayDirection = new THREE.Vector3(1, 0, 0).normalize();
  // raycaster.set(rayOrigin, rayDirection);
  // const intersect = raycaster.intersectObject(object1);
  // console.log(intersect);
  // const intersects = raycaster.intersectObjects([object1, object2, object3]);

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
  const raycaster = new THREE.Raycaster(rayOrigin, rayDirection);

  const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    meshs.forEach((mesh, i) => {
      mesh.position.y = Math.sin(elapsedTime * (i / meshs.length)) * 1.5;
    });

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(meshs);

    meshs.forEach((object) => {
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
      intersect.object.scale.set(2, 1.5, 1);
    });

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
  };

  tick();
};
genericBalls();
