// Imports
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as dat from 'dat.gui';

// Assets
const stageUrl = new URL("./public/models/corporate_event_stage.glb", import.meta.url);
const peopleUrl = new URL("./public/models/populate_idle_models_2000_frames.glb", import.meta.url);

// Images
const buildings = new URL('./public/images/buildings.jpg', import.meta.url);
const stars = new URL('./public/images/stars.jpg', import.meta.url);

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
  buildings.href
])

//Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 100, 200);


// Orbit controls
const orbit = new OrbitControls(camera, renderer.domElement);
orbit.update();

// Added models
loader.load(stageUrl.href, function (gltf) {
  const model = gltf.scene;
  scene.add(model)
})
loader.load(peopleUrl.href, function (gltf) {
  const model = gltf.scene;
  model.scale.set(20, 20, 20)
  model.rotation.y = 0.5 * Math.PI
  model.position.set(25, 0, 250);
  scene.add(model)
})

// Added lighting
const dl = new THREE.DirectionalLight(0xFFFFFF, 0.8);
dl.position.y = 200;
const dlHelper = new THREE.DirectionalLightHelper(dl, 3)
scene.add(dlHelper)
scene.add(dl);
const al = new THREE.AmbientLight(0xFFFFFF, 0.8);
al.position.set(0, 100, 200);
scene.add(al);

function animate(time) {


  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
