import '../css/style.css'
import * as THREE from "three";
import { gsap, Back } from "gsap";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { radians, map, distance } from './helpers';


let meshes, mouse3D, renderer, scene, camera, geometries;

const canvas = document.querySelector("#canvas");

let size = {
  width: window.innerWidth,
  height: window.innerHeight
};


class Box {
  constructor() {
    this.size = 0.7;
    this.geom = new THREE.BoxGeometry(this.size, this.size, this.size);
    this.rotationX = 0;
    this.rotationY = 0;
    this.rotationZ = 0;
  }
}

class Cone {
  constructor() {
    this.geom = new THREE.ConeBufferGeometry(0.5, 0.7, 32);
    this.rotationX = 0;
    this.rotationY = 0;
    this.rotationZ = radians(-180);
  }
}

class Dodecahedron {
  constructor() {
    this.geom = new THREE.DodecahedronGeometry(1.0);
    this.rotationX = 0;
    this.rotationY = 0;
    this.rotationZ = radians(-180);
  }
}
class Icosahedron {
  constructor() {
    this.geom = new THREE.IcosahedronGeometry(1.0);
    this.rotationX = 0;
    this.rotationY = 0;
    this.rotationZ = radians(-180);
  }
}
class Octahedron {
  constructor() {
    this.geom = new THREE.OctahedronGeometry(1.0);
    this.rotationX = 0;
    this.rotationY = 0;
    this.rotationZ = radians(-180);
  }
}
class Tetrahedron {
  constructor() {
    this.geom = new THREE.TetrahedronGeometry(1.0);
    this.rotationX = 0;
    this.rotationY = 0;
    this.rotationZ = radians(-180);
  }
}

function init(){

  // setup
  const raycaster = new THREE.Raycaster();

  meshes = [];
  const gutter = { size: 4 };
  const grid = { cols: 5, rows: 5 };
  mouse3D = new THREE.Vector2();
  geometries = [
    // new Box(),
    // new Cone(),
    new Dodecahedron(),
    new Icosahedron(),
    new Octahedron(),
    new Tetrahedron()
  ];



  // レンダラー
  renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(size.width, size.height);
  renderer.shadowMap.enable = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  //シーン
  scene = new THREE.Scene();

  //カメラ
  camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 1);
  camera.position.set(0, 120, 0);
  camera.rotation.x = radian(-45);
  scene.add(camera);

  //ウインドウとWebGL座標を一致させる
  // const fov = 45;
  // const fovRadian = (fov / 2) * (Math.PI / 180); //視野角をラジアンに変換
  // const distanceCamera = (size.height / 2) / Math.tan(fovRadian); //ウインドウぴったりのカメラ距離
  // camera = new THREE.PerspectiveCamera(fov, size.width / size.height, 1, distanceCamera * 2);
  // camera.position.z = distanceCamera;
  // camera.lookAt(new THREE.Vector3(0, 0, 0));
  // scene.add(camera);

  //コントローラー
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;

  //ライト
  const light01 = new THREE.DirectionalLight(0xffffff, 1.5);
  light01.position.set(5, 50, 0);
  light01.castShadow = true;
  scene.add(light01);

  // const helper = new THREE.DirectionalLightHelper( light01, 5 );
  // scene.add( helper );

  // const light02 = new THREE.SpotLight(0xffffff);
  // light02.position.set(-3, 100, 0);
  // light02.lookAt(0, 0, 0);
  // scene.add(light02);

  // const spotLightHelper = new THREE.SpotLightHelper( light02 );
  // scene.add( spotLightHelper );

  // const light03 = new THREE.RectAreaLight('#341212', 1, 2000, 2000);
  // light03.position.set(5, 50, 50);
  // light03.lookAt(0, 0, 0);
  // scene.add(light03);

  const light03 = new THREE.PointLight(0xFFFFFF, 2, 50, 1.0);
  light03.position.set(-5, 6, 0);
  scene.add(light03);

  const pointLightHelper = new THREE.PointLightHelper( light03 );
  scene.add( pointLightHelper );

  const light04 = new THREE.PointLight(0xFFFFFF, 2, 50, 1.0);
  light04.position.set(4, 10, 0);
  scene.add(light04);

  const pointLightHelper02 = new THREE.PointLightHelper( light04 );
  scene.add( pointLightHelper02 );

  const light05 = new THREE.PointLight(0xFFFFFF, 4, 100, 2.0);
  light05.position.set(4, 3, 0);
  scene.add(light05);

  const pointLightHelper03 = new THREE.PointLightHelper( light05 );
  scene.add( pointLightHelper03 );


  // const envImage = 'https://picsum.photos/id/223/1024/1024';
  const envImage = 'https://picsum.photos/id/106/1024/1024';
  const envTexures = [
    envImage, //right
    envImage, //left
    envImage, //up
    envImage, //down
    envImage, //front
    envImage, //back
  ];
  const cubeTextureLoader = new THREE.CubeTextureLoader()
  const textureCube = cubeTextureLoader.load( envTexures );

  //メッシュグループ
  const group = new THREE.Object3D();
  //グループのXとZを中心に
  const centerX = ((grid.cols - 1) + ((grid.cols - 1) * gutter.size)) * 0.5;
  const centerZ = ((grid.rows - 1) + ((grid.rows - 1) * gutter.size)) * 0.5;
  group.position.set(-centerX, 0, -centerZ);
  scene.add(group);

  //ランダムオブジェクトヘルパー
  function getRandomGeometry() {
    return geometries[Math.floor(Math.random() * Math.floor(geometries.length))];
  }

  //メッシュヘルパー
  function getMesh(geometry, material) {
    const mesh = new THREE.Mesh(geometry, material);

    mesh.castShadow = true;
    mesh.receiveShadow = true;

    return mesh;
  }

  //メッシュ
  const material = new THREE.MeshPhysicalMaterial({
    color: 0xFFFFFF,
    roughness: 0.1, //つや
    transmission: 0.98, //透明度
    thickness: 1.2, //屈折
    envMap: textureCube, // 環境マップ設定
    envMapIntensity: 1.5,
  });


  for(let row = 0; row < grid.rows; row++){
    meshes[row] = [];

    for(let col = 0; col < grid.cols; col++){
      const geometry = getRandomGeometry();
      const mesh = getMesh(geometry.geom, material);

      mesh.position.set(col + (col * gutter.size), 0, row + (row * gutter.size));
      mesh.rotation.x = geometry.rotationX;
      mesh.rotation.y = geometry.rotationY;
      mesh.rotation.z = geometry.rotationZ;

      //各要素の初期回転値を保存して、アニメーションで戻すことができるようにする
      mesh.initialRotation = {
        x: mesh.rotation.x,
        y: mesh.rotation.y,
        z: mesh.rotation.z,
      };

      group.add(mesh);

      //要素を配列内に保存して、アニメーション化が必要なときに元に戻れるようにする
      meshes[row][col] = mesh;
    }
  }

  //床
  // const floorGeometry = new THREE.PlaneGeometry(100, 100);
  // const floorMaterial = new THREE.ShadowMaterial({ opacity: .3 });
  // const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  // floor.position.y = 0;
  // floor.receiveShadow = true;
  // floor.rotateX(- Math.PI / 2);
  // scene.add(floor);

  const bgTexture = new THREE.TextureLoader().load("https://picsum.photos/id/106/1024/1024");
  const bgGeometry = new THREE.PlaneGeometry(25, 25);
  const bgMaterial = new THREE.MeshBasicMaterial({ map: bgTexture });
  const bgMesh = new THREE.Mesh(bgGeometry, bgMaterial);
  bgMesh.position.set(0, -1, 0);
  bgMesh.rotateX(- Math.PI / 2);
  bgMesh.receiveShadow = true;
  scene.add(bgMesh);


  let step = 0;
  let rad;

  function animate(){
    //カメラの視点からマウス座標をマッピング
    raycaster.setFromCamera(mouse3D, camera);
    //マウス座標が床の形状と交差するかどうかを確認
    const intersects = raycaster.intersectObjects([bgMesh]);

    if (intersects.length) {
      //交点の x 位置と z 位置を取得
      const { x, z } = intersects[0].point;

      for (let row = 0; row < grid.rows; row++) {
        for (let col = 0; col < grid.cols; col++) {
          //グリッド位置のメッシュ ベースを抽出
          const mesh = meshes[row][col];

          //交点からグリッド要素までの距離を計算
          const mouseDistance = distance(x, z,
            mesh.position.x + group.position.x,
            mesh.position.z + group.position.z
          );
          
          //距離に基づいて、値を最小最大 Y 位置にマッピング
          //半径範囲と同様に機能
          const maxPositionY = 10;
          const minPositionY = 0;
          const startDistance = 6;
          const endDistance = 0;
          const y = map(mouseDistance, startDistance, endDistance, minPositionY, maxPositionY);

          //y 位置に基づいて、mesh.position.y をアニメーション化 
          gsap.to(mesh.position, .4, { y: y < 1 ? 1 : y });

          //mesh.position.y に基づいて倍率を作成
          const scaleFactor = mesh.position.y / 2.5;

          //スケールを最小サイズの 1 に保つために、scaleFactor が 1 未満かどうかを確認
          const scale = scaleFactor < 1 ? 1 : scaleFactor;
          
          //プロパティをアニメーション
          gsap.to(mesh.scale, .4, {
            ease: Back.easeOut.config(1.7),
            x: scale,
            y: scale,
            z: scale,
          });

          gsap.to(mesh.rotation, 0.9, {
            ease: Back.easeOut.config(1.7),
            x: map(mesh.position.y, -1, 1, radians(45), mesh.initialRotation.x),
            z: map(mesh.position.y, -1, 1, radians(-90), mesh.initialRotation.z),
            y: map(mesh.position.y, -1, 1, radians(90), mesh.initialRotation.y),
          });
        }
      }
    }

    step += 0.8;
    rad = radian(step);

    // light01.position.x = 10 * Math.cos(rad * 0.1);
    // light01.position.z = 10 * Math.sin(rad * 0.1);

    light03.position.x = 15 * Math.cos(rad * 0.8);
    light03.position.z = 15 * Math.sin(rad * 0.8);

    light04.position.x = 12 * Math.cos(rad);
    light04.position.z = 12 * Math.sin(rad);

    light05.position.x = 15 * Math.sin(rad * 1.5);
    light05.position.z = 15 * Math.cos(rad * 1.5);

    // light04.position.x += Math.sin(10);


    //アニメーション処理
    // mesh.rotation.y += 0.01;
    // mesh.rotation.x += 0.01;
    
    //レンダリング
    renderer.render(scene, camera);
    controls.update();
    requestAnimationFrame(animate);
  }
  animate();
  
}

init();

// ラジアンに変換
function radian(val) {
  return (val * Math.PI) / 180;
}

// ランダムな数
// function random(min, max) {
//   return Math.random() * (max - min) + min;
// }

function onMouseMove(e) {
  mouse3D.x = (e.clientX / size.width) * 2 - 1;
  mouse3D.y = -(e.clientY / size.height) * 2 + 1;
}

window.addEventListener("mousemove", onMouseMove);

//リサイズ
function onWindowResize() {
  // レンダラーのサイズを修正
  renderer.setSize(window.innerWidth, window.innerHeight);
  // カメラのアスペクト比を修正
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}
window.addEventListener("resize", onWindowResize);
