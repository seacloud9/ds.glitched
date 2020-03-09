import React, {useRef} from 'react'
import * as THREE from 'three/src/Three'
import { useThree, useFrame } from 'react-three-fiber'
import VaporWave from './shaders/VaporWave'
/** This component creates a fullscreen colored plane */
function ShaderBackground({ color }) {
    const ref = useRef()
  const { viewport } = useThree()
  let iResolution = new THREE.Vector2(1,1)
  let time;
  useFrame(({clock}) => {
    time = clock.getElapsedTime();
    ref.current.material.uniforms.iGlobalTime.value = time;
  })
  
  return (
    <mesh ref={ref} scale={[viewport.width, viewport.height, 1]} position={[0,0,0]}>
      <planeGeometry attach="geometry" args={[1, 1]} />
      <shaderMaterial
        attach="material"
        args={[VaporWave]}
        uniforms-iGlobalTime-value={time}
        uniforms-iResolution-value={iResolution}
      />
    </mesh>
  )
}

export default ShaderBackground
