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
let lastSyncTime = 0;
let lastSyncedPosition = { x: 0, y: 0, z: 0 };
let _shops = [];
let users = [];
let isShopInited = false;
let isAppInited = false;

let video;
let videoImage;
let videoImageContext;
let videoTexture;

let _serverCall = (args) => {};

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

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas: document.getElementById("browser-shop-canvas"),
  });
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
          const texture = new THREE.TextureLoader().load(
            "./asset/3d/texture/marble_01_diff_1k.jpg"
          );
          texture.wrapS = THREE.RepeatWrapping;
          texture.wrapT = THREE.RepeatWrapping;
          texture.repeat.set(50, 50);
          child.material = new THREE.MeshBasicMaterial({ map: texture });
        } else if (child.name.includes("Square")) {
          child.material = textureAssets.Square;
          const texture = new THREE.TextureLoader().load(
            "./asset/3d/texture/large_square_pattern_01_diff_1k.jpg"
          );
          texture.wrapS = THREE.RepeatWrapping;
          texture.wrapT = THREE.RepeatWrapping;
          texture.repeat.set(20, 20);
          child.material = new THREE.MeshBasicMaterial({ map: texture });
        } else if (child.name.includes("Stairs")) {
          const texture = new THREE.TextureLoader().load(
            "./asset/3d/texture/floor_tiles_09_diff_1k.jpg"
          );
          texture.wrapS = THREE.RepeatWrapping;
          texture.wrapT = THREE.RepeatWrapping;
          texture.repeat.set(20, 20);
          child.material = new THREE.MeshBasicMaterial({ map: texture });
        } else if (child.name.includes("Concrete")) {
          const texture = new THREE.TextureLoader().load(
            "./asset/3d/texture/concrete_floor_02_diff_1k.jpg"
          );
          texture.wrapS = THREE.RepeatWrapping;
          texture.wrapT = THREE.RepeatWrapping;
          texture.repeat.set(1, 2);
          child.material = new THREE.MeshBasicMaterial({ map: texture });
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

const createProduct = ({ position, product }) => {
  if (
    position === null ||
    product === null ||
    product === undefined ||
    product.preview === null
  ) {
    console.log("invalid data");
    return;
  }

  const geometry = new THREE.BoxBufferGeometry(1, 1, 1);
  const texture = new THREE.TextureLoader().load(product.preview);
  const material = new THREE.MeshBasicMaterial({ map: texture });
  const mesh = new THREE.Mesh(geometry, material);

  mesh.position.copy({
    x: position.x,
    y: position.y,
    z: position.z,
  });
  scene.add(mesh);
};

const createShops = () => {
  if (!isShopInited && _shops.length > 0) {
    console.log(`Creating virtual shops`);
    isShopInited = true;
    _shops.forEach(({ shelters }) => {
      shelters.forEach((shelter) => {
        if (shelter) createProduct(shelter);
      });
    });
  }
};

const createVideoWall = () => {
  video = document.createElement("video");
  video.src = "./asset/lg_commercial.mp4";
  video.load();
  video.play();
  video.volume = 0.05;
  video.loop = true;

  videoImage = document.createElement("canvas");
  videoImage.width = 1270;
  videoImage.height = 720;

  videoImageContext = videoImage.getContext("2d");
  videoImageContext.crossOrigin = "anonymous";
  // background color if no video present
  videoImageContext.fillStyle = "#fff000";
  videoImageContext.fillRect(0, 0, videoImage.width, videoImage.height);

  videoTexture = new THREE.Texture(videoImage);
  videoTexture.minFilter = THREE.LinearFilter;
  videoTexture.magFilter = THREE.LinearFilter;

  let movieMaterial = new THREE.MeshBasicMaterial({
    map: videoTexture,
    overdraw: true,
    side: THREE.FrontSide,
  });

  let movieGeometry = new THREE.PlaneGeometry(8, 3.5, 50, 50);
  let movieScreen = new THREE.Mesh(movieGeometry, movieMaterial);
  movieScreen.position.set(-18.9, 2.5, 5);
  movieScreen.rotation.y = Math.PI / 2;
  scene.add(movieScreen);
};

const createUser = ({ id, name, position, isOwn, color }) => {
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
    name,
    body,
    mesh,
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

        blocker.style.display = "flex";

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

  if (video.readyState === video.HAVE_ENOUGH_DATA) {
    videoImageContext.drawImage(video, 0, 0);
    if (videoTexture) videoTexture.needsUpdate = true;
  }

  controls.update(Date.now() - time);
  renderer.render(scene, camera);

  if (users.length > 0 /* && lastSyncTime++ > 1 */) {
    const currentPosition = {
      x: users[0].body.position.x,
      y: users[0].body.position.y,
      z: users[0].body.position.z,
    };
    if (
      lastSyncedPosition.x.toFixed(1) != currentPosition.x.toFixed(1) ||
      lastSyncedPosition.y.toFixed(1) != currentPosition.y.toFixed(1) ||
      lastSyncedPosition.z.toFixed(1) != currentPosition.z.toFixed(1)
    ) {
      _serverCall(
        `{"header":"updatePosition","data":{"x":"${currentPosition.x}", "y":"${currentPosition.y}", "z":"${currentPosition.z}"}}`
      );
      lastSyncedPosition.x = currentPosition.x;
      lastSyncedPosition.y = currentPosition.y;
      lastSyncedPosition.z = currentPosition.z;
      lastSyncTime = 0;
    }
  }

  if (USE_DEBUG_RENDERER) debugRenderer.update();
  time = Date.now();
};

window.startBrowserShop = ({ serverCall, onReady, userName, id = "ownId" }) => {
  _serverCall = serverCall;
  loadTextures(assetConfig.textures, () => {
    initCannonJS();
    initThreeJS();
    createSkyBox();
    loadLevel(() => {
      createUser({
        id: id,
        name: userName,
        isOwn: true,
        position: { x: 40, y: 0.5, z: 10 },
      });
      controls = new PointerLockControls(camera, users[0].body);
      scene.add(controls.getObject());
      createVideoWall();
      init();
      animate();
      createShops();
      isAppInited = true;
      console.log(`Browser app has been inited`);
      onReady();
    });
  });
};

const getUserColor = () => {
  const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0x00ffff, 0xffffff];
  return colors[users.length];
};

window.addUsers = (users) => {
  users.forEach(({ id, name, position }) => {
    console.log(`Add user with id ${id} and with name ${name}`);
    createUser({
      id: id,
      name: name,
      isOwn: false,
      color: getUserColor(),
      position: position,
    });
  });
};

window.removeUser = (targetId) => {
  console.log(`Remove user with id ${targetId}`);
  var user = users.find(({ id }) => id === targetId);
  if (user) scene.remove(user.mesh);
  else console.log(`Remove error, user not found`);

  users = users.filter(({ id }) => id !== targetId);
};

window.updatePosition = ({ id, position }) => {
  const user = users.find((user) => user.id === id);
  if (user) user.mesh.position.copy(position);
};

window.setShops = (shops) => {
  console.log(`Set shops by the server (${shops.length})`);
  _shops = shops;
  if (!isShopInited && isAppInited) createShops();
};
