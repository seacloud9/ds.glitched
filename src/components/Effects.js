import * as THREE from 'three'
import React, { useRef, useEffect, useMemo } from 'react'
import {  extend as applyThree, useThree, useFrame } from 'react-three-fiber'
// A React animation lib, see: https://github.com/react-spring/react-spring
import { apply as applySpring, a } from 'react-spring/three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { GlitchPass } from '../postprocessing/GlitchPass'
applySpring({ EffectComposer, RenderPass, GlitchPass, UnrealBloomPass, ShaderPass })
applyThree({ EffectComposer, RenderPass, GlitchPass, UnrealBloomPass, ShaderPass })
const Effects = React.memo(({ factor }) => {
  const { gl, scene, camera, size } = useThree()
  const aspect = useMemo(() => new THREE.Vector2(size.width, size.height), [size])
  
  const composer = useRef()
  useEffect(() => void composer.current.setSize(size.width, size.height), [size])
  useFrame(() => composer.current.render(), 1)
  return (
    <effectComposer ref={composer} args={[gl]}>
      <renderPass attachArray="passes" scene={scene} camera={camera}  />
      <a.glitchPass attachArray="passes" renderToScreen factor={factor} />
      <unrealBloomPass attachArray="passes" args={[aspect, 0.2, 1, 0]} />
    </effectComposer>
  )
})

export default Effects
