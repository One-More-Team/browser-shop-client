import { FBXLoader } from "./lib/jsm/loaders/FBXLoader.js";
import CapsuleGeometry from "./lib/CapsuleGeometry.js";

import assetConfig from "./asset-config.js";

const USE_DEBUG_RENDERER = false;
let debugRenderer = null;

let world;
let scene;
let camera;
let renderer;
let controls;
let time = Date.now();
let textureAssets = {};

const users = [];

const initCannonJS = () => {
  world = new CANNON.World();
  world.quatNormalizeSkip = 0;
  world.quatNormalizeFast = false;
  world.defaultContactMaterial.contactEquationStiffness = 1e9;
  world.defaultContactMaterial.contactEquationRelaxation = 4;

  const solver = new CANNON.GSSolver();
  solver.iterations = 7;
  solver.tolerance = 0.1;
  world.solver = new CANNON.SplitSolver(solver);

  world.gravity.set(0, -20, 0);
  world.broadphase = new CANNON.NaiveBroadphase();

  const physicsMaterial = new CANNON.Material("slipperyMaterial");
  const physicsContactMaterial = new CANNON.ContactMaterial(
    physicsMaterial,
    physicsMaterial,
    0.0,
    0.3
  );
  world.addContactMaterial(physicsContactMaterial);

  const groundShape = new CANNON.Plane();
  const groundBody = new CANNON.Body({ mass: 0 });
  groundBody.addShape(groundShape);
  groundBody.quaternion.setFromAxisAngle(
    new CANNON.Vec3(1, 0, 0),
    -Math.PI / 2
  );
  world.add(groundBody);
};

const initThreeJS = () => {
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x000000, 0, 300);

  var alight = new THREE.AmbientLight(0xffffff);
  scene.add(alight);

  renderer = new THREE.WebGLRenderer();
  renderer.shadowMap.enabled = true;
  renderer.shadowMapSoft = true;
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(scene.fog.color, 1);

  if (USE_DEBUG_RENDERER)
    debugRenderer = new THREE.CannonDebugRenderer(scene, world);
};

const loadTextures = (textureConfig, onLoaded) => {
  const currentConfig = textureConfig[0];
  console.log(
    `Load texture asset ${currentConfig.id} from: ${currentConfig.url}`
  );
  new THREE.TextureLoader().load(currentConfig.url, (texture) => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(currentConfig.scaleX, currentConfig.scaleY);
    texture.rotation = currentConfig.rotation;
    textureAssets = {
      ...textureAssets,
      [currentConfig.id]: new THREE.MeshBasicMaterial({
        map: texture,
      }),
    };
    if (textureConfig.length > 1) {
      textureConfig.shift();
      loadTextures(textureConfig, onLoaded);
    } else onLoaded();
  });
};

const loadLevel = (onLoaded) => {
  var loader = new FBXLoader();

  loader.load("./asset/3d/shop.fbx", (object) => {
    object.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        if (child.name.includes("GrassL")) {
          child.material = textureAssets.GrassL;
        } else if (child.name.includes("Bricks")) {
          child.material = textureAssets.Bricks;
        } else if (child.name.includes("Floor")) {
          child.material = textureAssets.Floor;
        } else if (child.name.includes("Square")) {
          child.material = textureAssets.Square;
        }

        if (child.name.includes("Collider")) {
          const halfExtents = new CANNON.Vec3(
            child.scale.x / 100,
            child.scale.y / 100,
            child.scale.z / 100
          );
          const box = new CANNON.Box(halfExtents);
          const body = new CANNON.Body({ mass: 0 });
          body.addShape(box);
          body.position.copy(
            new CANNON.Vec3(
              child.position.x / 100,
              child.position.y / 100,
              child.position.z / 100
            )
          );
          body.quaternion.copy(child.quaternion);
          world.add(body);
        }
      }
    });

    object.scale.set(0.01, 0.01, 0.01);
    scene.add(object);

    onLoaded();
  });
};

const createSkyBox = () => {
  const textureEquirec = textureAssets.SkyBox.map;
  textureEquirec.mapping = THREE.EquirectangularReflectionMapping;
  textureEquirec.encoding = THREE.sRGBEncoding;
  const skyBoxGeometry = new THREE.IcosahedronBufferGeometry(400, 15);
  const skyBoxMaterial = new THREE.MeshLambertMaterial({
    envMap: textureEquirec,
  });
  const skyBoxMesh = new THREE.Mesh(skyBoxGeometry, skyBoxMaterial);
  scene.add(skyBoxMesh);
  scene.background = textureEquirec;
};

const createUser = ({ id, position, isOwn, color }) => {
  let mesh = null;
  let body = null;

  if (isOwn) {
    const mass = 5;
    const radius = 1.3;
    const shape = new CANNON.Sphere(radius);
    body = new CANNON.Body({ mass: mass });
    body.addShape(shape);
    body.position.set(position.x, position.y, position.z);
    body.linearDamping = 0.9;
    world.add(body);
  } else {
    const geometry = CapsuleGeometry(0.6, 1, 16);
    const material = new THREE.MeshBasicMaterial({ color: color });
    mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = Math.PI / 2;
    scene.add(mesh);
  }

  users.push({
    id,
    body,
    mesh,
    serverPosition: { x: position.x, y: position.y, z: position.z },
  });
};

function init() {
  var blocker = document.getElementById("blocker");
  var instructions = document.getElementById("instructions");

  var havePointerLock =
    "pointerLockElement" in document ||
    "mozPointerLockElement" in document ||
    "webkitPointerLockElement" in document;

  if (havePointerLock) {
    var element = document.body;

    var pointerlockchange = function (event) {
      if (
        document.pointerLockElement === element ||
        document.mozPointerLockElement === element ||
        document.webkitPointerLockElement === element
      ) {
        controls.enabled = true;

        blocker.style.display = "none";
      } else {
        controls.enabled = false;

        blocker.style.display = "-webkit-box";
        blocker.style.display = "-moz-box";
        blocker.style.display = "box";

        instructions.style.display = "";
      }
    };

    var pointerlockerror = function (event) {
      instructions.style.display = "";
    };

    // Hook pointer lock state change events
    document.addEventListener("pointerlockchange", pointerlockchange, false);
    document.addEventListener("mozpointerlockchange", pointerlockchange, false);
    document.addEventListener(
      "webkitpointerlockchange",
      pointerlockchange,
      false
    );

    document.addEventListener("pointerlockerror", pointerlockerror, false);
    document.addEventListener("mozpointerlockerror", pointerlockerror, false);
    document.addEventListener(
      "webkitpointerlockerror",
      pointerlockerror,
      false
    );

    instructions.addEventListener(
      "click",
      function (event) {
        instructions.style.display = "none";

        // Ask the browser to lock the pointer
        element.requestPointerLock =
          element.requestPointerLock ||
          element.mozRequestPointerLock ||
          element.webkitRequestPointerLock;

        if (/Firefox/i.test(navigator.userAgent)) {
          var fullscreenchange = function (event) {
            if (
              document.fullscreenElement === element ||
              document.mozFullscreenElement === element ||
              document.mozFullScreenElement === element
            ) {
              document.removeEventListener(
                "fullscreenchange",
                fullscreenchange
              );
              document.removeEventListener(
                "mozfullscreenchange",
                fullscreenchange
              );

              element.requestPointerLock();
            }
          };

          document.addEventListener(
            "fullscreenchange",
            fullscreenchange,
            false
          );
          document.addEventListener(
            "mozfullscreenchange",
            fullscreenchange,
            false
          );

          element.requestFullscreen =
            element.requestFullscreen ||
            element.mozRequestFullscreen ||
            element.mozRequestFullScreen ||
            element.webkitRequestFullscreen;

          element.requestFullscreen();
        } else {
          element.requestPointerLock();
        }
      },
      false
    );
  } else {
    instructions.innerHTML =
      "Your browser doesn't seem to support Pointer Lock API";
  }

  document.body.appendChild(renderer.domElement);

  window.addEventListener("resize", onWindowResize, false);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

const animate = () => {
  requestAnimationFrame(animate);

  world.step(1 / 60);
  users.forEach((user, index) => {
    if (index > 0) {
      user.mesh.position.copy(user.serverPosition);
    }
  });

  controls.update(Date.now() - time);
  renderer.render(scene, camera);

  if (USE_DEBUG_RENDERER) debugRenderer.update();
  time = Date.now();
};

loadTextures(assetConfig.textures, () => {
  initCannonJS();
  initThreeJS();
  createSkyBox();
  loadLevel(() => {
    createUser({
      id: "NewKrok",
      isOwn: true,
      position: { x: 40, y: 0.5, z: 10 },
    });
    controls = new PointerLockControls(camera, users[0].body);
    scene.add(controls.getObject());

    createUser({
      id: "Tibi",
      isOwn: false,
      color: 0xffff00,
      position: { x: 45, y: 0.5, z: 10 },
    });
    createUser({
      id: "Ricsi",
      isOwn: false,
      color: 0x0000ff,
      position: { x: 45, y: 0.5, z: 6 },
    });
    init();
    animate();
  });
});