
let scene, camera, renderer, controls, light, sphereCamera;

function init() {
  scene = new THREE.Scene();
  //scene.background = new THREE.Color(0xdddddd);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  //make scene dimmer
  renderer.toneMapping = THREE.ReinhardToneMapping;
  renderer.toneMappingExposure = 2.3;
  renderer.setSize(window.innerWidth, window.innerHeight);
  //
  renderer.shadowMap.enabled = true;


  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 1000);
  camera.position.set(0, 400, 1000);
  // use mouse to rotate camera
  controls = new THREE.OrbitControls(camera, renderer.domElement);

  scene.add(new THREE.AxesHelper(500));
  //sunlight - cast shadows
  light = new THREE.SpotLight(0xffa95c, 4);
  light.position.set(-50, 50, 50);
  light.castShadow = true;
  //reduce shadow intensity
  light.shadow.bias = -0.0001;
  light.shadow.mapSize.width = 1024 * 4;
  light.shadow.mapSize.height = 1024 * 4;
  scene.add(light);
  //sunlight = hemilight
  hemiLight = new THREE.HemisphereLight(0xffeeb1, 0x080820, 4);
  scene.add(hemiLight);

  //add scene to page as canvas element
  document.body.appendChild(renderer.domElement);


  /*      new THREE.GLTFLoader().load('model/scene.gltf', result => { 
          model = result.scene.children[0]; 
          model.position.set(0,-5,-25);
          model.traverse(n => { if ( n.isMesh ) {
            n.castShadow = true; 
            n.receiveShadow = true;
            if(n.material.map) n.material.map.anisotropy = 1; 
          }});
          scene.add(model);

          animate();
        });*/

  scene.background = new THREE.CubeTextureLoader()
    .setPath('CM_cafe/')
    .load([
      'px.png',
      'nx.png',
      'py.png',
      'ny.png',
      'pz.png',
      'nz.png'
    ]);

  //trick simulate real light sources
  //camera for shpere
  sphereCamera = new THREE.CubeCamera(1, 1000, 500);
  sphereCamera.position.set(0, -5, -25);
  scene.add(sphereCamera);

  var shader = THREE.FresnelShader;
  var uniforms = THREE.UniformsUtils.clone(shader.uniforms);
  uniforms["tCube"].value = scene.background;


  let sphereMaterial = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: shader.vertexShader,
    fragmentShader: shader.fragmentShader,
  })


  let sphereGeo = new THREE.SphereGeometry(350, 30, 30);
  let mirrorSphere = new THREE.Mesh(sphereGeo, sphereMaterial);
  mirrorSphere.position.set(0, -5, -25);
  mirrorSphere.receiveShadow = true;
  mirrorSphere.castShadow = true;

  let sphereMaterial_2 = new THREE.MeshBasicMaterial({
    side: THREE.FrontSide,
    color: 0x00ff00,
    wireframe: true,
  });

  let sphereGeo_2 = new THREE.SphereGeometry(400, 30, 30);
  let mirrorSphere_2 = new THREE.Mesh(sphereGeo_2, sphereMaterial_2);
  mirrorSphere_2.position.set(0, -5, -25);
  mirrorSphere_2.receiveShadow = true;
  mirrorSphere_2.castShadow = true;

  scene.add(mirrorSphere);

  scene.add(mirrorSphere_2);

  animate();
}

//create renderung loop function
function animate() {
  renderer.render(scene, camera);

  sphereCamera.updateCubeMap(renderer, scene);

  light.position.set(
    camera.position.x + 10,
    camera.position.y + 10,
    camera.position.z + 10,
  );
  requestAnimationFrame(animate);
}

init()
