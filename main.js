import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import TWEEN from "three/examples/jsm/libs/tween.module";
import { createText } from "./createText";

const scene = new THREE.Scene();
const spaceTexture = new THREE.TextureLoader().load("img/space.jpg");
scene.background = spaceTexture;

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

// avatar
const avatarMoon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: new THREE.TextureLoader().load("img/myface.jpg"),
  })
);
// jsMoon
const jsMoon = new THREE.Mesh(
  new THREE.SphereGeometry(2, 24, 24),
  new THREE.MeshStandardMaterial({
    map: new THREE.TextureLoader().load("img/js.jpg"),
  })
);
jsMoon.position.set(15, 2, 12);
jsMoon.rotateX(Math.PI);
jsMoon.rotateZ(Math.PI * 1.1);
scene.add(jsMoon);

avatarMoon.position.set(15, 10, 10);
avatarMoon.rotateX(Math.PI);
avatarMoon.rotateZ(Math.PI);

// geek
const geekCube = new THREE.Mesh(
  new THREE.BoxGeometry(5, 5, 5),
  new THREE.MeshStandardMaterial({
    map: new THREE.TextureLoader().load("img/geekbrains.jpg"),
  })
);

geekCube.position.set(16, 6, 0);
scene.add(geekCube);

createText(
  "I've been working in GB for \n 2 years as a Code Reviewer",
  scene,
  [10, 2, 0],
  -Math.PI / 6
);

// epam
const epamCube = new THREE.Mesh(
  new THREE.BoxGeometry(5, 5, 5),
  new THREE.MeshStandardMaterial({
    map: new THREE.TextureLoader().load("img/epam.jpg"),
  })
);
epamCube.position.set(6, 7, -16);
scene.add(epamCube);

createText(
  "I worked at EPAM from 2020 to 2022 \n as a Middle Frontend Developer",
  scene,
  [1, 2, -13],
  Math.PI / 4
);

// lux
const luxCube = new THREE.Mesh(
  new THREE.BoxGeometry(5, 5, 5),
  new THREE.MeshStandardMaterial({
    map: new THREE.TextureLoader().load("img/luxoft.jpg"),
  })
);
luxCube.position.set(-13, 7, -12);
scene.add(luxCube);

createText(
  "I started my work on Luxoft as\n Junior Frontend Developer in 2018\n and ended up in a middle position",
  scene,
  [-19, 2, -8],
  Math.PI / 2
);

// zavod
const zavodCube = new THREE.Mesh(
  new THREE.BoxGeometry(5, 5, 5),
  new THREE.MeshStandardMaterial({
    map: new THREE.TextureLoader().load("img/zavod.jpg"),
  })
);
zavodCube.position.set(-4, 7, 16);
scene.add(zavodCube);

createText(
  "I`ve been working in Minsk Tractor Zavod for\n 5 years and desided to switch in IT ))",
  scene,
  [3, 2, 18],
  Math.PI
);

// hello

createText(
  "Hello! My Name is Podpolniy!\n im a Frontend Developer\n (ReactJS, NextJS, Typescript)\n scroll to see more!",
  scene,
  [13, 6, 12],
  -Math.PI / 1.5,
  0.4
);

// stars
Array(200)
  .fill()
  .forEach(() => {
    const star = new THREE.Mesh(
      new THREE.SphereGeometry(0.25, 24, 24),
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
      })
    );
    const [x, y, z] = Array(3)
      .fill()
      .map(() => THREE.MathUtils.randFloatSpread(100));
    star.position.set(x, y, z);
    scene.add(star);
  });

const light = new THREE.PointLight(0xffffff, 100);
const globalLight = new THREE.AmbientLight(0xffffff); // soft white light
const gridHelper = new THREE.GridHelper(200, 50);
const axesHelper = new THREE.AxesHelper(5);
scene.add(light, globalLight, avatarMoon, gridHelper, axesHelper);

const clock = new THREE.Clock();
const controls = new OrbitControls(camera, renderer.domElement);

let x0 = 0;
let z0 = 10;
let y0 = 5;

camera.position.set(x0, y0, z0);
camera.lookAt(new THREE.Vector3(10, 5, 10));

const moveCamera = (delta) => {
  const cosDelta = Math.cos(delta);
  const sinDelta = Math.sin(delta);
  const newX = x0 * cosDelta + z0 * sinDelta;
  const newZ = z0 * cosDelta - x0 * sinDelta;

  let remainingDelta = delta;
  new TWEEN.Tween(camera.position)
    .onUpdate((_, elapsed) => {
      const elapsedDelta = elapsed * remainingDelta;
      camera.rotateY(elapsedDelta);
      remainingDelta = remainingDelta - elapsedDelta;
    })
    .to({ x: newX, z: newZ }, 300)
    .start();
  x0 = newX;
  z0 = newZ;
};

/* document.body.addEventListener("mousewheel", (e) => {
  moveCamera(e.deltaY / 1600);
}); */


//model
let mixer;
const modelLoader = new GLTFLoader()
modelLoader.load("models/Michelle.glb", (gltf) => {
  const object = gltf.scene
  mixer = new THREE.AnimationMixer(object)
  const action = mixer.clipAction(gltf.animations[0])
  action.play()
  object.position.set(16, 9, 0)
  object.scale.set(4, 4, 4)
  scene.add(object)
})


function animate() {
  const delta = clock.getDelta();
  controls.update();
  TWEEN.update();
  if (mixer) {
    mixer.update(delta)
  }
  jsMoon.rotateX(delta / 5);
  geekCube.rotateY(delta / 10);
  epamCube.rotateY(delta / 10);
  luxCube.rotateY(delta / 10);
  zavodCube.rotateY(delta / 10);
  renderer.render(scene, camera);
  window.requestAnimationFrame(animate);
}
animate();
