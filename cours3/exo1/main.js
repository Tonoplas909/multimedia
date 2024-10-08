import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const loader = new GLTFLoader();

loader.load(
  "/wheelchair_json.glb",
  function (gltf) {
    gltf.scene.rotation.y += Math.PI;
    gltf.scene.position.x += Math.PI;
    scene.add(gltf.scene);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
  wireframe: true,
});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

camera.position.z = 5;
camera.position.x = 1;
camera.position.y = 3;
camera.rotateX(-(Math.PI / 8));

const floorGeometry = new THREE.PlaneGeometry(500, 500);
const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22 });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -1;
scene.add(floor);

const textureLoader = new THREE.TextureLoader();
const backgroundTexture = textureLoader.load('/overworld_bg.png');
scene.background = backgroundTexture;

const rainCount = 15000;
const rainGeometry = new THREE.BufferGeometry();
const rainVertices = [];

for (let i = 0; i < rainCount; i++) {
  const x = Math.random() * 400 - 200;
  const y = Math.random() * 500 - 250;
  const z = Math.random() * 400 - 200;
  rainVertices.push(x, y, z);
}

rainGeometry.setAttribute('position', new THREE.Float32BufferAttribute(rainVertices, 3));

const rainMaterial = new THREE.PointsMaterial({
  color: 0x0000ff,
  size: 0.1,
  transparent: true
});

const rain = new THREE.Points(rainGeometry, rainMaterial);
scene.add(rain);

function animate() {
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  rainGeometry.attributes.position.array.forEach((value, index) => {
    if (index % 3 === 1) {
      rainGeometry.attributes.position.array[index] -= 0.1;
      if (rainGeometry.attributes.position.array[index] < -200) {
        rainGeometry.attributes.position.array[index] = 200;
      }
    }
  });
  rainGeometry.attributes.position.needsUpdate = true;

  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);
