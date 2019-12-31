import React, { useRef, useEffect } from 'react'
import {  extend as applyThree, useThree, useRender } from 'react-three-fiber'
// A React animation lib, see: https://github.com/react-spring/react-spring
import { apply as applySpring, a } from 'react-spring/three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { GlitchPass } from '../postprocessing/GlitchPass'
applySpring({ EffectComposer, RenderPass, GlitchPass, UnrealBloomPass, ShaderPass })
applyThree({ EffectComposer, RenderPass, GlitchPass, UnrealBloomPass, ShaderPass })

/** This component creates a glitch effect */
const Effects = React.memo(({ factor }) => {
  const { gl, scene, camera, size } = useThree()
  const composer = useRef()
  useEffect(() => void composer.current.setSize(size.width, size.height), [size])
  // This takes over as the main render-loop (when 2nd arg is set to true)
  useRender(() => composer.current.render(), true)
  return (
    <effectComposer ref={composer} args={[gl]}>
      <renderPass attachArray="passes" args={[scene, camera]} />
      <a.glitchPass attachArray="passes" renderToScreen factor={factor} />
      <unrealBloomPass attachArray="passes" args={[undefined, 0.2, 1, 0]} />
    </effectComposer>
  )
})

export default Effects
