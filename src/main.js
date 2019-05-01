import * as THREE from 'three';

import Debug from "./framesynthesis/Debug";
import Utils from "./Utils";
import Player from "./Player";
import Ball from "./Ball";

Debug.log("Hello, ECMAScript!");

let renderer;
let camera;

const globalTimer = new THREE.Clock();

// setup Three.js
renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(0, 0, 10);
camera.lookAt(new THREE.Vector3(0, 0, 0));

window.addEventListener("resize", function () {
    const w = window.innerWidth;
    const h = window.innerHeight;

    camera.aspect = w / h;
    camera.updateProjectionMatrix();

    renderer.setSize(w, h);
}, false);

// create scene
const scene = new THREE.Scene();

// create lights
scene.add(new THREE.AmbientLight(0x101010));

const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.5);
directionalLight.position.set(-1, 1, 1);
scene.add(directionalLight);

// let light = new THREE.PointLight(0xFFFFFF);
// light.position.set(1, 1, 1);
// scene.add(light);

// create player
const geometry = new THREE.BoxGeometry(1, 1, 1);
//let material = new THREE.MeshLambertMaterial({
//    color: 0x00FF00
//});

const texture = THREE.ImageUtils.loadTexture("assets/pixeltest.png");
const material = new THREE.MeshBasicMaterial({map: texture});

const player = new Player();
const playerMesh = new THREE.Mesh(geometry, material);
scene.add(playerMesh);

// create balls
const BALL_NUM = 30;
const balls = [];
const ballMeshes = [];

for (let i = 0; i < BALL_NUM; i++) {
    const geometry = new THREE.SphereGeometry(0.5, 16, 16);
    const material = new THREE.MeshLambertMaterial({
        color: 0x00FF00
    });

    const ball = new Ball();
    balls.push(ball);

    const ballMesh = new THREE.Mesh(geometry, material);
    scene.add(ballMesh);

    ballMeshes.push(ballMesh);
}

let prevPosition;
let rotateX = 0;
let rotateY = 0;

let running = true;

// setup user input
document.ontouchstart = function (event) {
    prevPosition = Utils.toLogicalPosition(event.pageX, event.pageY);
};

document.ontouchmove = document.ontouchend = function (event) {
    const position = Utils.toLogicalPosition(event.pageX, event.pageY);
    rotateX = (position.x - prevPosition.x) * 3;
    rotateY = (position.y - prevPosition.y) * 3;
    prevPosition = position;

    event.preventDefault();
};

const xyPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
const targetPosition = new THREE.Vector3();

document.onmousemove = function (event) {
    let ratio;
    if (window.devicePixelRatio) {
        ratio = window.devicePixelRatio;
    } else {
        ratio = 1;
    }
    const mouseX = event.pageX * ratio;
    const mouseY = event.pageY * ratio;

    // Project mouse position to the XY plane
    const x = (mouseX / renderer.domElement.width) * 2 - 1;
    const y = -(mouseY / renderer.domElement.height) * 2 + 1;
    const mouse = new THREE.Vector3(x, y, 0);
    mouse.unproject(camera);

    const ray = new THREE.Ray(camera.position, mouse.sub(camera.position).normalize());
    targetPosition = ray.intersectPlane(xyPlane);
};

document.addEventListener("keydown", (e) => {
    if (e.keyCode === 27) {
        running = false;
    }
});

// game loop
function update() {
    if (!running) {
        return;
    }
    requestAnimationFrame(update);
    const deltaTime = globalTimer.getDelta();
    
    player.update(deltaTime, targetPosition);
    player.physicsUpdate(deltaTime);

    playerMesh.position.x = player.position.x;
    playerMesh.position.y = player.position.y;
    playerMesh.quaternion.setFromAxisAngle(new THREE.Vector3(0, 0, 1), player.rotation);

    for (let i = 0; i < BALL_NUM; i++) {
        balls[i].update(deltaTime);
        balls[i].physicsUpdate(deltaTime);
        ballMeshes[i].position.copy(balls[i].position);
    }

    rotateX = 0;
    rotateY = 0;

    renderer.render(scene, camera);
}

update();

