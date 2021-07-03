import * as THREE from 'three'
import ReactDOM from 'react-dom'
import React, { useCallback, useEffect, useRef, useMemo } from 'react'
import { Canvas, extend, useFrame, useThree } from 'react-three-fiber'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { AfterimagePass } from 'three/examples/jsm/postprocessing/AfterimagePass'
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { WaterPass } from './Waterpass'
import VoxelVader, { VoxelVaderMesh } from './components/VoxelVader'
import './styles.css'

// Makes these prototypes available as "native" jsx-string elements
extend({ EffectComposer, ShaderPass, RenderPass, WaterPass, AfterimagePass, UnrealBloomPass })

function Swarm({ count, mouse }) {
  const mesh = useRef()
  const light = useRef()
  const { size, viewport } = useThree()
  const aspect = size.width / viewport.width

  const dummy = useMemo(() => new THREE.Object3D(), [])
  // Generate some random positions, speed factors and timings
  const particles = useMemo(() => {
    const temp = []
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100
      const factor = 20 + Math.random() * 100
      const speed = 0.01 + Math.random() / 200
      const xFactor = -50 + Math.random() * 100
      const yFactor = -50 + Math.random() * 100
      const zFactor = -50 + Math.random() * 100
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 })
    }
    return temp
  }, [count])
  // The innards of this hook will run every frame
  useFrame(state => {
    // Makes the light follow the mouse
    light.current.position.set(mouse.current[0] / aspect, -mouse.current[1] / aspect, 0)
    // Run through the randomized data to calculate some movement
    particles.forEach((particle, i) => {
      let { t, factor, speed, xFactor, yFactor, zFactor } = particle
      // There is no sense or reason to any of this, just messing around with trigonometric functions
      t = particle.t += speed / 2
      const a = Math.cos(t) + Math.sin(t * 1) / 10
      const b = Math.sin(t) + Math.cos(t * 2) / 10
      const s = Math.cos(t)
      particle.mx += (mouse.current[0] - particle.mx) * 0.01
      particle.my += (mouse.current[1] * -1 - particle.my) * 0.01
      // Update the dummy object
      dummy.position.set(
        (particle.mx / 10) * a + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
        (particle.my / 10) * b + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
        (particle.my / 10) * b + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
      )
      dummy.scale.set(s, s, s)
      dummy.rotation.set(s * 5, s * 5, s * 5)
      dummy.updateMatrix()
      // And apply the matrix to the instanced item
      //mesh.current.setMatrixAt(i, dummy.matrix)
      //console.log('mesh', mesh)
    })
    //mesh.current.instanceMatrix.needsUpdate = true
  })

  const developVaders = (count) => {
    let vaders = [];
    for(let i = 0; i < count; i++){
      vaders.push(
        <VoxelVader key={`vader+${i}`} />
      )
    }
    console.log(vaders, count)
    return vaders
  }
  const vaders = developVaders(count)
  //console.log('VoxelVaderMesh', VoxelVaderMesh())
  return (
    
    <>
      <pointLight ref={light} distance={40} intensity={8} color="lightblue">
        <mesh>
          <sphereBufferGeometry attach="geometry" args={[3.5, 32, 32]} />
          <meshBasicMaterial attach="material" color="lightblue" />
        </mesh>
      </pointLight>
      <instancedMesh ref={mesh} args={[null, null, count]}>
        <VoxelVader />
      </instancedMesh>
    </>
  )
}

function Effect() {
  const composer = useRef()
  const { scene, gl, size, camera } = useThree()
  const aspect = useMemo(() => new THREE.Vector2(size.width, size.height), [size])
  useEffect(() => void composer.current.setSize(size.width, size.height), [size])
  useFrame(() => composer.current.render(), 1)
  return (
    <effectComposer ref={composer} args={[gl]}>
      <renderPass attachArray="passes" scene={scene} camera={camera} />
      <afterimagePass attachArray="passes" uniforms-damp-value={0.3} />
      <unrealBloomPass attachArray="passes" args={[aspect, 1.5, 1, 0]} />
      <shaderPass attachArray="passes" args={[FXAAShader]} uniforms-resolution-value={[1 / size.width, 1 / size.height]} renderToScreen />
    </effectComposer>
  )
}

function Dolly() {
  // This one makes the camera move in and out
  useFrame(({ clock, camera }) => camera.updateProjectionMatrix(void (camera.position.z = 50 + Math.sin(clock.getElapsedTime()) * 30)))
  return null
}

function App() {
  const mouse = useRef([0, 0])
  const onMouseMove = useCallback(({ clientX: x, clientY: y }) => (mouse.current = [x - window.innerWidth / 2, y - window.innerHeight / 2]), [])
  return (
    <div style={{ width: '100%', height: '100%' }} onMouseMove={onMouseMove}>
      <Canvas camera={{ fov: 75, position: [0, 0, 70] }}>
        <pointLight distance={60} intensity={2} color="white" />
        <spotLight intensity={0.5} position={[0, 0, 70]} penumbra={1} color="lightblue" />
        <mesh>
          <planeBufferGeometry attach="geometry" args={[10000, 10000]} />
          <meshPhongMaterial attach="material" color="#272727" depthTest={false} />
        </mesh>
        <Swarm mouse={mouse} count={80} />
        <Effect />
        <Dolly />
      </Canvas>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
