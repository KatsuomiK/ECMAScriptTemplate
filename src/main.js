import Utils from "./Utils";
import Player from "./Player";
import Ball from "./Ball";

let renderer;
let camera;

let globalTimer = new THREE.Clock();

// ========================================================================
// Setup Three.js
renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(0, 0, 10);
camera.lookAt(new THREE.Vector3(0, 0, 0));

window.addEventListener("resize", function () {
    let w = renderer.domElement.width;
    let h = renderer.domElement.height;

    camera.aspect = w / h;
    camera.updateProjectionMatrix();

    renderer.setSize(w, h);
}, false);

// ========================================================================
// Create scene
let scene = new THREE.Scene();

// Create lights
scene.add(new THREE.AmbientLight(0x101010));

let directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.5);
directionalLight.position.set(-1, 1, 1);
scene.add(directionalLight);

// let light = new THREE.PointLight(0xFFFFFF);
// light.position.set(1, 1, 1);
// scene.add(light);

// Create player
let geometry = new THREE.BoxGeometry(1, 1, 1);
//let material = new THREE.MeshLambertMaterial({
//    color: 0x00FF00
//});

let texture = THREE.ImageUtils.loadTexture("assets/pixeltest.png");
let material = new THREE.MeshBasicMaterial({map: texture});

let player = new Player();
let playerMesh = new THREE.Mesh(geometry, material);
scene.add(playerMesh);

// Create balls
let BALL_NUM = 30;
let balls = [];
let ballMeshes = [];

for (let i = 0; i < BALL_NUM; i++) {
    let geometry = new THREE.SphereGeometry(0.5, 16, 16);
    let material = new THREE.MeshLambertMaterial({
        color: 0x00FF00
    });

    let ball = new Ball();
    balls.push(ball);

    let ballMesh = new THREE.Mesh(geometry, material);
    scene.add(ballMesh);

    ballMeshes.push(ballMesh);
}

let prevPosition;
let rotateX = 0;
let rotateY = 0;

// ========================================================================
// Setup user input
document.ontouchstart = function (event) {
    prevPosition = Utils.toLogicalPosition(event.pageX, event.pageY);
};

document.ontouchmove = document.ontouchend = function (event) {
    let position = Utils.toLogicalPosition(event.pageX, event.pageY);
    rotateX = (position.x - prevPosition.x) * 3;
    rotateY = (position.y - prevPosition.y) * 3;
    prevPosition = position;

    event.preventDefault();
};

let xyPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
let targetPosition = new THREE.Vector3();

document.onmousemove = function (event) {
    let ratio;
    if (window.devicePixelRatio) {
        ratio = window.devicePixelRatio;
    } else {
        ratio = 1;
    }
    let mouseX = event.pageX * ratio;
    let mouseY = event.pageY * ratio;

    // Project mouse position to the XY plane
    let x = (mouseX / renderer.domElement.width) * 2 - 1;
    let y = -(mouseY / renderer.domElement.height) * 2 + 1;
    let mouse = new THREE.Vector3(x, y, 0);
    mouse.unproject(camera);

    let ray = new THREE.Ray(camera.position, mouse.sub(camera.position).normalize());
    targetPosition = ray.intersectPlane(xyPlane);
};

// ========================================================================
// Game loop
function render() {
    let i;

    let deltaTime = globalTimer.getDelta();

    player.update(deltaTime, targetPosition);
    player.physicsUpdate(deltaTime);

    playerMesh.position.x = player.position.x;
    playerMesh.position.y = player.position.y;
    playerMesh.quaternion.setFromAxisAngle(new THREE.Vector3(0, 0, 1), player.rotation);

    for (i = 0; i < BALL_NUM; i++) {
        balls[i].update(deltaTime);
        balls[i].physicsUpdate(deltaTime);
        // ballMeshes[i].position = balls[i].position;
        ballMeshes[i].position.copy(balls[i].position);
    }

    rotateX = 0;
    rotateY = 0;

    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

requestAnimationFrame(render);
