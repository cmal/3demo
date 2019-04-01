//import * as THREE from 'three';
import * as $ from 'jquery';
import * as dat from 'dat.gui';
import 'three/examples/js/QuickHull';
import 'three/examples/js/geometries/ConvexGeometry.js';
import 'three/examples/js/controls/OrbitControls.js';
import 'three/examples/js/ParametricGeometries.js';
import 'three/examples/js/utils/SceneUtils.js';

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
  
  $('#webgl').replaceWith(renderer.domElement);
  // renderer.render( scene, camera );
  var step = 0;

  var stats = initStats();

  var controls = initControls();

  // addFog();
  // overrideMaterial();
  addGeometries();

  function renderScene() {
    stats.update();
    cube.rotation.x += controls.rotationSpeed;
    cube.rotation.y += controls.rotationSpeed;
    cube.rotation.z += controls.rotationSpeed;

    step += controls.bouncingSpeed;
    sphere.position.x = 30 + ( 10 * Math.cos(step) );
    sphere.position.y = 4 + ( 5 * Math.abs(Math.sin(step)) );
    
    requestAnimationFrame( renderScene );
    renderer.render( scene, camera );
  }
  renderScene();

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

function initStats() {
  var stats = new Stats();
  stats.setMode(0);
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';
  document.getElementById("stats").appendChild( stats.domElement );
  return stats;
}

function initControls() {
  var controls = new function() {
    this.rotationSpeed = 0.2;
    this.bouncingSpeed = 0.3;
  };
  var gui = new dat.GUI();
  gui.add(controls, 'rotationSpeed', 0, 0.5);
  gui.add(controls, 'bouncingSpeed', 0, 0.5);
  return controls;
}

function addFog() {
  // scene.fog = new THREE.Fog(0xffffff, 0.015, 100);
  scene.fog = new THREE.FogExp2(0xffffff, 0.01);
}

function overrideMaterial() {
  scene.overrideMaterial = new THREE.MeshLambertMaterial({
    color: 0xffffff
  });
}


function addGeometries() {
  var geoms = [];
  geoms.push(new THREE.CylinderGeometry(1,4,4));
  // basic cube
  geoms.push(new THREE.CubeGeometry(2,2,2));
  // console.log(new THREE.CubeGeometry(2,2,2));
  // basic spherer
  geoms.push(new THREE.SphereGeometry(2));
  geoms.push(new THREE.IcosahedronGeometry(4));
  // create a convex shape (a shape without dents)
  // using a couple of points
  // for instance a cube
  var points = [
    new THREE.Vector3( 2, 2, 2 ),
    new THREE.Vector3( 2, 2, -2 ),
    new THREE.Vector3( -2, 2, -2 ),
    new THREE.Vector3( -2, 2, 2 ),
    new THREE.Vector3( 2, -2, 2 ),
    new THREE.Vector3( 2, -2, -2 ),
    new THREE.Vector3( -2, -2, -2 ),
    new THREE.Vector3( -2, -2, 2 )
  ];
  geoms.push(new THREE.ConvexGeometry(points));
  // create a lathgeometry
  // http://en.wikipedia.org/wiki/Lathe_(graphics)

  // points array - the path profile points will be stored here
  var pts = [];
  // half-circle detail - how many angle increments will be used to generate points
  var detail = .1;
  // radius for half_sphere
  var radius = 3;

  // loop from 0.0 radians to PI (0 - 180 degrees)
  for(var angle = 0.0; angle < Math.PI ; angle += detail) {
    // angle/radius to x,z
    pts.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
  }
  geoms.push(new THREE.LatheGeometry( pts, 12 ));
  // create a OctahedronGeometry
  geoms.push(new THREE.OctahedronGeometry(3));
  // create a geometry based on a function
  geoms.push(new THREE.ParametricGeometry( THREE.ParametricGeometries.mobius3d, 20, 10 ));
  geoms.push(new THREE.TetrahedronGeometry(3));
  geoms.push(new THREE.TorusGeometry(3, 1, 10, 10));
  geoms.push(new THREE.TorusKnotGeometry(3, 0.5, 50, 20));

  var j = 0;
  for (var i = 0 ; i < geoms.length ; i++) {
    // var cubeMaterial = new THREE.MeshLambertMaterial({
    //   wireframe: true,
    //   color: Math.random() * 0xffffff
    // });
    var materials = [
      new THREE.MeshLambertMaterial(
        {
          color: Math.random() * 0xffffff,
          shading: THREE.FlatShading
        }),
      new THREE.MeshBasicMaterial(
        {
          color: 0x000000,
          wireframe: true
        })
    ];
    var mesh = THREE.SceneUtils.createMultiMaterialObject(geoms[i], materials);
    mesh.traverse(function(e) {
      e.castShadow=true;
    });
    // var mesh = new THREE.Mesh(geoms[i],materials[i]);
    // mesh.castShadow=true;
    mesh.position.x = -24 + ((i % 4) * 12);
    mesh.position.y = 4;
    mesh.position.z = -8 + (j * 12);
    if ((i + 1) % 4 == 0) {
      j ++;
    }
    scene.add(mesh);
  }
}
