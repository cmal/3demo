import * as THREE from 'three';
import * as $ from 'jquery';
import * as stats from 'stats.js';

var renderer;
var camera;
var scene;
var axes;
var plane;
var planeGeometry;
var planeMaterial;

export function init() {

  renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(new THREE.Color(0xEEEEEE, 1.0));
  renderer.setSize(innerWidth, innerHeight);
  renderer.shadowMapEnabled = true;

  camera = new THREE.PerspectiveCamera(75, innerWidth/innerHeight, .1, 1000);

  scene = new THREE.Scene();

  axes = new THREE.AxesHelper(20);
  scene.add(axes);


  planeGeometry = new THREE.PlaneGeometry(60, 20, 1, 1);
  planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
  plane = new THREE.Mesh(planeGeometry, planeMaterial);

  plane.rotation.x = -.5 * Math.PI;
  plane.position.x = 30;
  plane.position.y = 0;
  plane.position.z = 10;
  plane.receiveShadow = true;

  scene.add(plane);

  var cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
  var cubeMaterial = new THREE.MeshLambertMaterial({color: 0xff0000});
  var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

  cube.position.x = 4;
  cube.position.y = 3;
  cube.position.z = 5;
  cube.castShadow = true;

  scene.add(cube);
  
  var sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
  var sphereMaterial = new THREE.MeshLambertMaterial({color: 0x7777ff});
  var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

  sphere.position.x = 30;
  sphere.position.y = 4;
  sphere.position.z = 5;
  sphere.castShadow = true;
  scene.add(sphere);

  var spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(-40, 60, -10);
  spotLight.castShadow = true;
  scene.add(spotLight);

  var ambientLight = new THREE.AmbientLight( 0x0c0c0c );
  scene.add(ambientLight);
  
  camera.position.set(-30,40,30);
  camera.lookAt(scene.position);
  
  $('#WebGL-output').replaceWith(renderer.domElement);
  // renderer.render( scene, camera );
  var step = 0;

  function animate() {
    cube.rotation.x += .02;
    cube.rotation.y += .02;
    cube.rotation.z += .02;

    step += .04;
    sphere.position.x = 30 + ( 10 * Math.cos(step) );
    sphere.position.y = 4 + ( 5 * Math.abs(Math.sin(step)) );
    
    requestAnimationFrame( animate );
    renderer.render( scene, camera );
  }
  animate();

  bindResizeEvent();
  function bindResizeEvent() {
    window.addEventListener('resize', onResize, false);
  }

  function onResize() {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  }

}

var cubes = [];

export function addCube() {
  var cubeSize = Math.ceil(Math.random() * 3);
  var cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);

  var cubeMaterial = new THREE.MeshLambertMaterial({color: Math.random() * 0xffffff});
  var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  cubes.push(cube);
  cube.castShadow = true;
  cube.name = "cube-" + cubes.length;

  cube.rotation.x = Math.random() * Math.PI;
  cube.position.x = Math.round(Math.random() * planeGeometry.parameters.width);
  cube.position.y = Math.round(Math.random() * 5);
  cube.position.z = Math.round(Math.random() * planeGeometry.parameters.height);

  scene.add(cube);
  renderer.render( scene, camera );
}

export function removeCube() {
  if (cubes.length) {
    scene.remove(cubes.pop());
  }
  renderer.render( scene, camera );
}

export function printCubes() {
  cubes.forEach(console.log);
}



