// Imports
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { FirstPersonControls } from "three/addons/controls/FirstPersonControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import * as dat from "dat.gui";

// Assets
const stageUrl = new URL(
  "./public/models/corporate_event_stage.glb",
  import.meta.url
);
const peopleUrl = new URL(
  "./public/models/populate_idle_models_2000_frames.glb",
  import.meta.url
);
const wareHouseUrl = new URL(
  "./public/models/80s_warehouse.glb",
  import.meta.url
);

// Images
const buildings = new URL("./public/images/buildings.jpg", import.meta.url);
const stars = new URL("./public/images/stars.jpg", import.meta.url);

// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Texture and GTFL Loaders
const loader = new GLTFLoader();
const textureLoader = new THREE.TextureLoader();
const ctLoader = new THREE.CubeTextureLoader();

// Scene
const scene = new THREE.Scene();
scene.background = ctLoader.load([
  buildings.href,
  buildings.href,
  stars.href,
  stars.href,
  buildings.href,
  buildings.href,
]);

//Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 30, 300);

// Controls
const orbit = new OrbitControls(camera, renderer.domElement);
orbit.update();

function setupCameraMovement(camera, speed = 0.1) {
  // Keep track of pressed keys
  const keysPressed = {};

  // Update the camera position based on key states
  function moveCamera() {
    if (keysPressed["w"]) {
      // Move forward
      camera.position.z -= speed;
    }
    if (keysPressed["s"]) {
      // Move backward
      camera.position.z += speed;
    }
    if (keysPressed["a"]) {
      // Move left
      camera.position.x -= speed;
    }
    if (keysPressed["d"]) {
      // Move right
      camera.position.x += speed;
    }
  }

  // Listen to keydown and keyup events to update keysPressed
  function onKeyDown(event) {
    keysPressed[event.key.toLowerCase()] = true;
  }

  function onKeyUp(event) {
    keysPressed[event.key.toLowerCase()] = false;
  }

  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);

  // Call moveCamera in your animation loop
  return moveCamera;
}

const moveCamera = setupCameraMovement(camera);

// Added models
loader.load(wareHouseUrl.href, function (gltf) {
  const model = gltf.scene;
  model.scale.set(25, 25, 25);
  model.rotation.y = 1.5 * Math.PI;
  scene.add(model);
});
loader.load(peopleUrl.href, function (gltf) {
  const model = gltf.scene;
  model.scale.set(19, 19, 19);
  model.rotation.y = Math.PI * 1.5;
  model.position.set(-20, 0, 500);
  scene.add(model);
});

// Added Sound
const listener = new THREE.AudioListener();
camera.add(listener);

const sound = new THREE.Audio(listener);

const audioLoader = new THREE.AudioLoader();
audioLoader.load("/audio/club_music.mp3", function (buffer) {
  sound.setBuffer(buffer);
  sound.setLoop(true);
  sound.setVolume(0.5);
  sound.play();
});

// Added lighting
const dl = new THREE.DirectionalLight(0xffffff, 0.8);
dl.position.y = 200;
const dlHelper = new THREE.DirectionalLightHelper(dl, 3);
scene.add(dlHelper);
scene.add(dl);
const al = new THREE.AmbientLight(0xffffff, 0.8);
al.position.set(0, 100, 200);
scene.add(al);

function animate(time) {
  requestAnimationFrame(animate);

  // Move camera based on WASD input
  moveCamera();

  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
