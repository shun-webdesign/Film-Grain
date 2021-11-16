import './style/main.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { BloomPass } from 'three/examples/jsm/postprocessing/BloomPass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { CopyShader } from 'three/examples/jsm/shaders/CopyShader'

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 100, window.innerWidth/window.innerHeight, 0.1, 1000 );
camera.position.y = 6
var renderer = new THREE.WebGLRenderer()
renderer.setSize( window.innerWidth, window.innerHeight )
document.body.appendChild( renderer.domElement )


// Test
const cube = new THREE.Mesh(new THREE.TorusGeometry( 5, 3, 16, 50 ), new THREE.MeshNormalMaterial())
scene.add(cube)


scene.add(new THREE.AmbientLight(0x666666));

var directionalLight = new THREE.DirectionalLight( 0xffffff, 1);
directionalLight.castShadow = false;
directionalLight.position.set(-2,4,-2);
directionalLight.target = cube;

scene.add( directionalLight );


//COMPOSER

var composer = new EffectComposer(renderer);
var renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

//custom shader pass
var vertShader = document.getElementById('vertexShader').textContent;
var fragShader = document.getElementById('fragmentShader').textContent;
var counter = 0.0;
var myEffect = {
  uniforms: {
    "tDiffuse": { value: null },
    "amount": { value: counter }
  },
  vertexShader: vertShader,
  fragmentShader: fragShader
}

var customPass = new ShaderPass(myEffect);
customPass.renderToScreen = true;
composer.addPass(customPass);

//RENDER LOOP
render();


function render() {
  var timer = Date.now() * 0.0002;
  camera.position.x = Math.cos(timer) * 10;
  camera.position.z = Math.sin(timer) * 10;
  camera.lookAt(new THREE.Vector3(0,1,0));

  counter += 0.01;
  customPass.uniforms["amount"].value = counter;

  requestAnimationFrame( render );
  composer.render();
}
