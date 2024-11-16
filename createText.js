import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import * as THREE from "three";
import { FontLoader } from 'three/addons/loaders/FontLoader.js';

const loader = new FontLoader();

const materials = [
    new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true }), // front
    new THREE.MeshPhongMaterial({ color: 0xffffff }),
]

export const createText = (textString, scene, position, rotationY, size) => {
  loader.load("fonts/helvetiker_regular.typeface.json", function (font) {
    const geometry = new TextGeometry(textString, {
      font: font,
      size: size || 1,
      depth: 0.2,
    });

    geometry.computeBoundingBox()
    const textObject = new THREE.Mesh(geometry, materials)
    textObject.position.set(...position)
    textObject.rotateY(rotationY)
    scene.add(textObject)
  });
};
