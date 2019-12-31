import React, { useRef } from 'react'
import { useRender, useFrame, useThree } from 'react-three-fiber'
import * as THREE from 'three/src/Three'
import { a } from 'react-spring/three'
let voxelVaderMesh
const generateVoxel = ({colorPool, color, ambientColor, size, steps, padding, materials, camera, scene, groups}) => {
        const createVaderMesh = (material) =>  {
             return new THREE.Mesh(
                 new THREE.CubeGeometry(1, 1, 1),
                 material
             );
         }
 
         const VaderMesh = (obj = {}) => {
             obj.vaderObj = new THREE.Object3D();
             obj.bg = new THREE.Object3D();
             let col = [];
             for (let j = 0; j < size; j += steps) {
                 let m = 1;
                 col[j] = [];
                 for (let i = 0; i < size / 2; i += steps) {
                     let c = (Math.random(1) > .5) ? false : true;
                     col[j][i] = c;
                     col[j][i + (size - steps) / m] = c;
                     m++;
                 }
             }
             for (let j = 0; j < size; j += steps) {
                 for (let i = 0; i < size; i += steps) {
                     let vadersBG = createVaderMesh(materials[1]);
                        vadersBG.position.set(i, j, 4);
                        vadersBG.visible = col[j][i];
                        vadersBG.vaderT = "bg";
                        obj.bg.add(vadersBG);
                        obj.vaderObj.add(vadersBG);
                 }
             }
             return obj.vaderObj;
         }
 
         let voxelInvader = VaderMesh();
         /// merging geometry
         let visibileArrBG = [];
         let visibileArr = [];
         let meshInvaderVisibile = (obj) => {
             for (let i = 0; obj.children.length > i; i++) {
                 if (obj.children[i].children.length === 0 && obj.children[i].visible === true && obj.children[i].vaderT === "bg") {
                     visibileArrBG.push(obj.children[i]);
                 } else if (obj.children[i].visible === true && obj.children[i].vaderT === "front") {
                     visibileArr.push(obj.children[i]);
                 } else {
                     meshInvaderVisibile(obj.children[i])
                 }
             }
         }
         meshInvaderVisibile(voxelInvader);
         var mergedGeo = new THREE.Geometry();
         var mergedGeoBG = new THREE.Geometry();
         for (let i = 0; visibileArr.length > i; i++) {
                 THREE.GeometryUtils.merge(mergedGeo, visibileArr[i]);
         }
         for (let i = 0; visibileArrBG.length > i; i++) {
                 THREE.GeometryUtils.merge(mergedGeoBG, visibileArrBG[i]);
         }
 
         let glowMaterial = new THREE.ShaderMaterial({
             uniforms: {
                 "c": {
                     type: "f",
                     value: 0
                 },
                 "p": {
                     type: "f",
                     value: 5.3
                 },
                 glowColor: {
                     type: "c",
                     value: new THREE.Color(0xffff00)
                 },
                 viewVector: {
                     type: "v3",
                     value: camera.position
                 }
             },
             vertexShader: `
             uniform vec3 viewVector;
             uniform float c;
             uniform float p;
             varying float intensity;
             void main() 
             {
                 vec3 vNormal = normalize( normalMatrix * normal );
                 vec3 vNormel = normalize( normalMatrix * viewVector );
                 intensity = pow( c - dot(vNormal, vNormel), p );
                 
                 gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
             }
             `,
             fragmentShader: `
             uniform vec3 glowColor;
             varying float intensity;
             void main() 
             {
                 vec3 glow = glowColor * intensity;
                 gl_FragColor = vec4( glow, 1.0 );
             }
             `,
             side: THREE.DoubleSide,
             blending: THREE.AdditiveBlending,
             opacity: 0.3,
             transparent: true
         });
         groups.push(new THREE.Mesh(mergedGeoBG, materials[0]));
         groups[(groups.length - 1)].isGlowing = false;
         groups.push(new THREE.Mesh(mergedGeoBG, glowMaterial.clone()));
         groups[(groups.length - 1)].scale.multiplyScalar(1.1);
         groups[(groups.length - 1)].isGlowing = true;
     
         groups.push(new THREE.Mesh(mergedGeo, glowMaterial.clone()));
         groups[(groups.length - 1)].scale.multiplyScalar(1.1);
         groups[(groups.length - 1)].isGlowing = true;
         groups.push(new THREE.Mesh(mergedGeo, materials[1]));
         groups[(groups.length - 1)].isGlowing = false;
         const removeNonMerged = (obj) => {
             for (let i = 0; obj.children.length > i; i++) {
                 if (obj.children !== undefined && obj.children[i].children.length === 0 && obj.children[i].visible === true) {
                     obj.children[i].visible = false;
                     obj.children[i].vaderT = "hidden";
                     removeNonMerged(voxelInvader);
                 } else if (obj.children !== undefined) {
                     removeNonMerged(obj.children[i]);
                 }
             }
         }
         removeNonMerged(voxelInvader);
         for (let i = 0; i < groups.length; i++) {
            voxelInvader.add(groups[i]);
         }
         voxelInvader.lookAt(camera);
         voxelVaderMesh = voxelInvader
         window.scene = scene
         return voxelInvader
}

function VoxelVader({
    colorPool = [0x800830, 0x7F0863, 660000, 0x5B001A, 0x65087F, 0xff0084, 0x00F1F9],
    color  = [new THREE.Color(colorPool[Math.floor(Math.random() * colorPool.length)]), new THREE.Color(colorPool[Math.floor(Math.random() * colorPool.length)])],
    ambientColor  = [0x800830, 0x800830],
    size = 5,
    steps = size / 5,
    padding = parseInt(size / 2),
    materials =  [
        new THREE.MeshPhongMaterial({
            color: color[0],
            ambient: color[0],
            specular: 0xffff00,
            emissive: 0x111111,
            shininess: 100
        }),
        new THREE.MeshLambertMaterial({
            ccolor: color[1],
            ambient: color[1],
            specular: 0xffff00,
            emissive: 0x111111,
            shininess: 100
        }),
    ]
}) {
    const {
        scene,                        // Default scene
        camera,                       // Default camera
      } = useThree()
  let groups = [];
  let groupRef = useRef()
  let meshRef = useRef()
  useRender(() => {

  })

  useFrame((state, dt) => {
    if (groups.length) {
        for (let i = 0; i < groups.length; i++) {
            if (groups[i].isGlowing) {
                groups[i].material.uniforms.viewVector.value =
                    new THREE.Vector3().subVectors(camera.position, voxelVaderMesh.position);
            }
        }
    }
    return
  })
  const voxelMesh = generateVoxel({colorPool, color, ambientColor, size, steps, padding, materials, camera, scene, groups}) 
  return (
    <a.group ref={groupRef} position={[0, 0, 0]} name='VoxelGroup' scale={[0.25,0.25,0.25]}>
      <primitive object={voxelMesh}  
      name={'VoxelVader'}
      ref={meshRef}
      position={[0, -4, 0]}
      rotation={[0,0,0]}
      />
    }
    </a.group>
  )
}

export default VoxelVader
