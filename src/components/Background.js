import React from 'react'
//import * as THREE from 'three/src/Three'
import { useThree } from 'react-three-fiber'
import { a } from 'react-spring/three'
/** This component creates a fullscreen colored plane */
function Background({ color }) {
  const { viewport } = useThree()
  return (
    <mesh scale={[viewport.width, viewport.height, 1]} position={[0,0,0]}>
      <planeGeometry attach="geometry" args={[1, 1]} />
      <a.meshBasicMaterial attach="material" color={color} depthTest={false} />
    </mesh>
  )
}

export default Background
