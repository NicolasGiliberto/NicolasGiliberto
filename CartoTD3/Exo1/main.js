import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Initialisation de la scène
const scene = new THREE.Scene();

// Création de la caméra
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Création du renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Création de la géométrie pour le cube
const geometry = new THREE.BoxGeometry(1, 1, 1);

// Chargement de la texture pour le cube
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('/italie.png');  // Assurez-vous que l'image est dans le dossier public

// Création du matériau avec la texture
const material = new THREE.MeshStandardMaterial({ map: texture });

// Création du cube
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Chargement du modèle GLTF (le ballon)
const loader = new GLTFLoader();
let ballon;

loader.load(
  'football.glb',
  function (gltf) {
    ballon = gltf.scene;
    ballon.position.set(2, 0, 0);  // Positionnement du ballon pour qu'il ne se chevauche pas avec le cube
    scene.add(ballon);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

// Position de la caméra
camera.position.z = 5;

// Ajout de lumières
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Variables pour stocker les valeurs d'orientation
let alpha = 0, beta = 0, gamma = 0;

// Fonction pour gérer l'orientation de l'appareil
function handleOrientation(event) {
  alpha = event.alpha;  // Rotation autour de l'axe Z (rotation horizontale)
  beta = event.beta;    // Rotation autour de l'axe X (inclinaison avant/arrière)
  gamma = event.gamma;  // Rotation autour de l'axe Y (inclinaison gauche/droite)
}

// Fonction d'animation
function animate() {
  // Utilisation des valeurs de DeviceOrientation pour animer les objets
  cube.rotation.x = THREE.MathUtils.degToRad(beta);   // Utiliser beta pour faire tourner le cube autour de l'axe X
  cube.rotation.y = THREE.MathUtils.degToRad(gamma);  // Utiliser gamma pour faire tourner le cube autour de l'axe Y

  if (ballon) {
    ballon.rotation.x = THREE.MathUtils.degToRad(beta);  // Faire tourner le ballon également
    ballon.rotation.y = THREE.MathUtils.degToRad(gamma);
  }

  renderer.render(scene, camera);
}

// Écoute des événements DeviceOrientation
window.addEventListener('deviceorientation', handleOrientation);

// Boucle d'animation
renderer.setAnimationLoop(animate);
