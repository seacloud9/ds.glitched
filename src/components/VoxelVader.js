import React, { useRef } from 'react'
import {  useFrame, useThree } from 'react-three-fiber'
import * as THREE from 'three/src/Three'
let voxelVaderMesh

export const generateVoxel = ({colorPool, color, ambientColor, size, steps, padding, materials, camera, scene, groups}) => {
        const createVaderMesh = (material) =>  {
             return new THREE.Mesh(
                 new THREE.CubeGeometry(1, 1, 1)
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
                     let vadersBG = createVaderMesh();
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
            mergedGeo.mergeMesh(visibileArr[i]);
         }
         for (let i = 0; visibileArrBG.length > i; i++) {
            mergedGeoBG.mergeMesh(visibileArrBG[i]);
         }
 

         let glowMaterialGen = (_color) =>  new THREE.ShaderMaterial({
             uniforms: {
                 "c": {
                     type: "f",
                     value: 1.0
                 },
                 "p": {
                     type: "f",
                     value: 0.6
                 },
                 glowColor: {
                     type: "c",
                     value: new THREE.Color(_color)
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
                 vec3 glow = glowColor * intensity ;
                 gl_FragColor = vec4( glow, 1.0 );
             }
             `,
             side: THREE.DoubleSide,
             blending: THREE.AdditiveBlending,
             transparent: true
         });
         groups.push(new THREE.Mesh(mergedGeoBG, glowMaterialGen(color[0])));
         groups.push(new THREE.Mesh(mergedGeoBG, glowMaterialGen(color[0])));
         groups[(groups.length - 1)].scale.multiplyScalar(1.1);
         groups.push(new THREE.Mesh(mergedGeo,glowMaterialGen(color[1]) ));
         groups[(groups.length - 1)].scale.multiplyScalar(1.1);
         groups.push(new THREE.Mesh(mergedGeo,glowMaterialGen(color[1])));
 
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
         return voxelInvader
}

function VoxelVader({
    colorPool = [0xff004b, 0x0000ff, 0x00ff3c, 0x6900ff, 0xff0000, 0x00b3ff, 0x1e00ff],
    color  = [new THREE.Color(colorPool[Math.floor(Math.random() * colorPool.length)]), new THREE.Color(colorPool[Math.floor(Math.random() * colorPool.length)])],
    ambientColor  = [0x800830, 0x800830],
    size = 5,
    steps = size / 5,
    padding = parseInt(size / 2),
    materials =  [
        new THREE.MeshPhongMaterial({
            color: color[0],
            specular: 0xffff00,
            //emissive: 0x111111,
        }),
        new THREE.MeshLambertMaterial({
            color: color[1],
            emissive: 0xffff00,
            reflectivity: 1.5
        }),
    ],
    position = [0, 0, 0],
}) {
    const {
        scene,                        // Default scene
        camera,                       // Default camera
      } = useThree()
  let groups = [];
  let meshRef = useRef()
  
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
  const voxelMesh = generateVoxel({colorPool, color, ambientColor, size, steps, padding, materials, camera, scene, groups});
  return (
      <primitive 
      object={voxelMesh}  
      name={'VoxelVader'}
      ref={meshRef}
      position={position}
      rotation={[0,0,0]}
      scale={[0.25,0.25,0.25]}
      />
  )
}

export default VoxelVader
