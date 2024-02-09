










// ====================================================

function vertexShader() {
    return `
    varying vec3 vUv; 

    void main() {
      vUv = position; 

      vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * modelViewPosition; 
    }   `
  }

function fragmentShader(){
    return `
    uniform vec3 colorA; 
    uniform vec3 colorB; 
    varying vec3 vUv;

    void main() {
      gl_FragColor = vec4(mix(colorA, colorB, vUv.z), 1.0);
    }
    `
}

var FX_Shaderbox = function(options){

    var scene = new THREE.Scene();

    var _options = options || {};
    var startTime = _options.starttime || 0;

    var attributes = {};
    var uniforms = {
        colorB: {type: 'vec3', value: new THREE.Color(0xACB6E5)},
        colorA: {type: 'vec3', value: new THREE.Color(0x74ebd5)}
    }

    var material =  new THREE.ShaderMaterial({
        uniforms: uniforms,
        fragmentShader: fragmentShader(),
        vertexShader: vertexShader(),
      });


    //vertexShader: document.getElementById( 'vertex-shader' ).textContent, 
    //fragmentShader: document.getElementById( 'fragment-shader' ).textContent

    var boxMesh = new THREE.Mesh(
        new THREE.BoxGeometry(300, 300, 300),
        material
    );

    scene.add(boxMesh);

    light = new THREE.AmbientLight();
    scene.add(light )

    var tween_slide_left = new TWEEN.Tween(boxMesh.position)
        .to({x: -400}, 2000) //window.innerWidth - window.innerWidth/2
        .easing(TWEEN.Easing.Sinusoidal.Out);

    tween_slide_left.start(startTime);
    return {
        render: function(dt, time){
            boxMesh.rotation.x += dt * 2 * Math.PI / 5;
            boxMesh.rotation.y += dt * 2 * Math.PI / 7;
            boxMesh.rotation.z += dt * 2 * Math.PI / 11;
  
            renderer.render(scene, camera);
        }
    };

}

var FX_starfield = function (options){

    var options = options || {};
    var startTime = options.starttime || 0;
    var stars = options.stars || 100;
    var size = options.size || 10;

    var scene = new THREE.Scene();

    var points = [];

    for (var i = 0; i < stars * 3; i++) {
        points.push(Math.random() * 7000-3500 )
    }

    var vertices = new Float32Array(points);

    var geometry = new THREE.BufferGeometry();
    geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );

    var texture = new THREE.TextureLoader().load( './gfx/star.png', function ( texture ) {} );

    var material = new THREE.PointsMaterial({
        //color: 0xffffff,
        //color: 0x0033ff,
        map: texture,
        depthTest:false,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 1,
        size: size
    });

    material.color.setHSL(Math.random(), 1, 1);

    var particles = new THREE.Points(geometry, material);
/*
    particles.rotation.x = Math.random() * 15;
    particles.rotation.y = Math.random() * 15;
    particles.rotation.z = Math.random() * 15;
*/
    scene.add(particles);

    console.log(particles);

    var r = g = b = 0;

    return {
        render: function(dt, from, to, time){
            material.color.setRGB((time % 1).toFixed(1), 0.9, 0.9);
            
            if(time < 3000){
                particles.position.z -= 4; // dt * 200 * Math.PI / 5;
            }else if(time < 6000){
                particles.position.z += 6;
            }else if(time < 9000){
                particles.position.z += 6;
                particles.rotation.z += 0.005;
            }else{
                particles.position.z += 8;
                particles.rotation.z -= 0.02;
            }

            
            var fadeToWhite = (time > to - 800 && time < to - 500); // fading 300ms
            var fadeToBlack = (time > to-500); // fading and clear effect            
            if(fadeToWhite){
                r = g = b += 0.1;
                renderer.setClearColor(new THREE.Color( r, g, b ));
            }else if(fadeToBlack){
                particles.visible = false;
                r = g = b -= 0.1;
                renderer.setClearColor(new THREE.Color( r, g, b ));
            }

            renderer.render(scene, camera);
        }
    };
}


var FX_meshbox = function(options){

    var _options = options || {};
    var startTime = _options.starttime || 0;

    var scene = new THREE.Scene();

    var basic = new THREE.MeshBasicMaterial({
        color: '#f00',
        wireframe: true
    });

    var standard = new THREE.MeshStandardMaterial({
        color: '#0f0',
        flatShading: true,
        vertexColors: false,
        wireframe: false,
        fog: true
    });

    var normal = new THREE.MeshNormalMaterial({
        flatShading: true
    })

    var boxMesh = new THREE.Mesh(
        new THREE.BoxGeometry(300, 300, 300),
        normal
    );
    scene.add(boxMesh);

    // used for Standard Material
    const color = 0xFFFFFF;
    const intensity = 0.1;
    const light = new THREE.AmbientLight(color, intensity);
    scene.add(light);

    var tween_slide_left = new TWEEN.Tween(boxMesh.position)
        .delay(2000)
        .to({x: -300}, 2000) //window.innerWidth - window.innerWidth/2
        .easing(TWEEN.Easing.Sinusoidal.Out);

    tween_slide_left.start(startTime);

    return {
        render: function(dt, from, to, time){
            boxMesh.rotation.x += dt * 2 * Math.PI / 5;
            boxMesh.rotation.y += dt * 2 * Math.PI / 7;
            boxMesh.rotation.z += dt * 2 * Math.PI / 11;
  
  
/*
            seconds = 3 -- How fast do you want the tween to go
            Time = distance / seconds.
            TweenInfo.new(Time,Enum.EasingStyle.Linear)
*/
            
            renderer.render(scene, camera);
        }
    };
}

var FX_texter = function(txt){
    var scene = new THREE.Scene();

    var font = new THREE.Font( fontJSON );

    var material = new THREE.MeshBasicMaterial({
        color: 0xF3FFE2,
        transparent: true
    });

    var chars = txt.split('');
    var char_meshes = [];
    var char_positions = [
        [0,0],
        [20, 0],
        [40, 0],
        [60, 0],
        [80, 0],
        [100, 0]
    ]

    for(var i = 0; i < chars.length; i++){
        var txtGeometry = new THREE.TextGeometry(chars[i], {
            font: font,
            size: 30,
            height: 1,
            curveSegments: 10,
            bevelEnabled: false,
        });
        txtGeometry.center();

        var mesh = new THREE.Mesh(txtGeometry, material);
        mesh.material.opacity = 0.1;

        mesh.position.x = char_positions[i][0]
        mesh.position.y = char_positions[i][1]

        mesh.rotation.y = 300;

        char_meshes.push(new THREE.Mesh(mesh));

        scene.add(mesh);
    }



    return {
        render: function(dt, time){
            
            renderer.render(scene, camera);
        }
    };
}


var FX_text = function(txt, options){

    var _options = options || {};
    var startTime = _options.starttime || 0;

    var scene = new THREE.Scene();

    var font = new THREE.Font( fontJSON );

    var txtGeometry = new THREE.TextGeometry(txt, {
        font: font,
        size: 30,
        height: 5,
        curveSegments: 12,
        bevelEnabled: false,
        bevelThickness: 10,
        bevelSize: 8,
        bevelOffset: 0,
        bevelSegments: 5
    });

    txtGeometry.center();

    var material = new THREE.MeshBasicMaterial({
        color: 0xF3FFE2
    });
    
    var mesh = new THREE.Mesh(txtGeometry, material);
    mesh.position.x = window.innerWidth + 848; // 235

    scene.add(mesh);

    var tween_slide_in = new TWEEN.Tween(mesh.position)
        .to({x: 0}, 3000)
        .easing(TWEEN.Easing.Elastic.InOut);

    var tween_slide_out = new TWEEN.Tween(mesh.position)
        .delay(4000) // How long the text should be shown
        .to({x: window.innerWidth + 848}, 3000)
        .easing(TWEEN.Easing.Elastic.Out)
        .onStart(function(){
            mesh.material.transparent = true;
            new TWEEN.Tween(mesh.material).to({ opacity: 0 }, 100).start();
        });

    tween_slide_in.chain(tween_slide_out);
    tween_slide_in.start(startTime);

    return {
        render: function(dt, time){

            
            renderer.render(scene, camera);
        }
    };
}