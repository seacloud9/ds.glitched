import React, { useRef } from 'react'
import { useRender, useFrame, useUpdate } from 'react-three-fiber'
import * as THREE from 'three/src/Three'
import { a } from 'react-spring/three'

function Ocean({
  width = 200,
  depth = 200,
  density = 45,
  amplitude = 0.3,
  amplitudeVariance = 0.3,
  speed = 1,
  speedVariance = 2,
  color = 0x92E2E2,
  opacity = 0.8
}) {

  let groupRef = useRef()
  let meshRef = useUpdate(
    geometry => {
      geometry = new THREE.PlaneGeometry(width, depth, density, density)
      geometry.mergeVertices()
      for (let v, i = 0, l = geometry.vertices.length; i < l; i++) {
        v = geometry.vertices[i]
          waves.push({
            z: v.z,
            ang: Math.random() * Math.PI * 2,
            amp: amplitude + Math.random() * amplitudeVariance,
            speed: (speed + Math.random() * speedVariance) / 1000 // radians / frame
          })
      }
      return geometry
    }
  )
  let theta = 0
  let waves = []

  useRender(() => {
    //const r = 5 * Math.sin(THREE.Math.degToRad((theta += 0.01)))
    const s = Math.cos(THREE.Math.degToRad(theta * 2))
    //groupRef.current.rotation.set(r, r, r)
    groupRef.current.scale.set(s, s, s)
  })

  useFrame((state, dt) => {
    const time = state.clock.getElapsedTime()
    if (!dt) return
    const verts = meshRef.current.geometry.vertices
    if(verts && verts.length){
      let v, vprops
      for (let i = 0; i < verts.length; i++) {
        v = verts[i]
        vprops = waves[i]
        v.z = vprops.z + Math.sin(vprops.ang) * vprops.amp
        vprops.ang += vprops.speed * time
      }
      meshRef.current.geometry.verticesNeedUpdate = true
    }
    return
  })
  const matProps = {
    color: color,
    transparent: opacity < 1,
    opacity: opacity,
    flatShading: true,
    name: 'ocean',
  }

  return (
    <a.group ref={groupRef} position={[0, 0, 0]}>
      <mesh ref={meshRef}  
      position={[0, -4, 0]}
      rotation={[-45,0,0]}
      >
      <planeGeometry attach="geometry"  args={[width, depth, density, density]} />
      <meshPhongMaterial attach="material" {...matProps}  />
      </mesh>
    }
    </a.group>
  )
}

export default Ocean
