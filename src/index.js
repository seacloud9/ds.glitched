import ReactDOM from 'react-dom'
import React, { useCallback } from 'react'
import { Provider } from 'react-redux'
import { Route, Switch } from 'react-router' // react-router v4/v5
import { ConnectedRouter } from 'connected-react-router'
import configureStore, { history } from './configureStore'
// A THREE.js React renderer, see: https://github.com/drcmda/react-three-fiber
import { Canvas, useThree } from 'react-three-fiber'
// A React animation lib, see: https://github.com/react-spring/react-spring
import { useSpring, a, animated } from 'react-spring/three'
import './styles.css'
import Background from './components/Background'
import ShaderBackground from './components/ShaderBackground'
import Effects from './components/Effects'
import Images from './components/Images'
import Stars from './components/Stars'
import Text from './components/Text'
import Ocean from './components/Ocean'
import VoxelVader from './components/VoxelVader'
const store = configureStore()

function Intro({ top, mouse }) {
  const { size } = useThree()
  const scrollMax = size.height * 4.5
  const { pos } = useSpring({
    to: async (next, cancel) => {
      await next({pos: [0,0,2]})
    },
    from: {pos: [0,0,-10]}
  })

  return (
    <>
      <a.spotLight intensity={0.4} color="white" position={mouse.interpolate((x, y) => [x / 100, -y / 100, 6.5])} />
      <Effects factor={top.interpolate([0, 150], [1, 0])} />
      <Stars position={top.interpolate(top => [0, -1 + top / 20, 0])} />
      <Images top={top} mouse={mouse} scrollMax={scrollMax} offset={10000} />
      <Text opacity={top.interpolate([0, 200], [1, 0])} position={top.interpolate(top => [0, -1 + top / 200, 0])}>
        lorem
      </Text>
      <animated.group position={pos}>
      <group>
        <VoxelVader />
      </group>
      </animated.group>
      <Ocean position={top.interpolate(top => [0, -10 + ((top * 15) / scrollMax) * 2, 0])} />
      <Text position={top.interpolate(top => [0, -20 + ((top * 10) / scrollMax) * 2, 0])} color="black" fontSize={150}>
        Ipsum
      </Text>
      <ShaderBackground />
    </>
  )
}

function Test({ top, mouse }) {
  const { size } = useThree()
  const scrollMax = size.height * 4.5
  return (
    <>
      <a.spotLight intensity={0.4} color="white" position={mouse.interpolate((x, y) => [x / 100, -y / 100, 6.5])} />
      <Effects factor={top.interpolate([0, 150], [1, 0])} />
      <Stars position={top.interpolate(top => [0, -1 + top / 20, 0])} />
      <Images top={top} mouse={mouse} scrollMax={scrollMax} offset={10000} />
      <Text opacity={top.interpolate([0, 200], [1, 0])} position={top.interpolate(top => [0, -1 + top / 200, 0])}>
        Test
      </Text>
      <VoxelVader position={top.interpolate(top => [0, -10 + ((top * 15) / scrollMax) * 2, 0])} />
      <Ocean position={top.interpolate(top => [0, -10 + ((top * 15) / scrollMax) * 2, 0])} />
      <Text position={top.interpolate(top => [0, -20 + ((top * 10) / scrollMax) * 2, 0])} color="black" fontSize={150}>
        Ipsum
      </Text>
      <Background
        color={top.interpolate(
          [0, scrollMax * 0.1, scrollMax * 0.2, scrollMax * 0.3, scrollMax * 0.4, scrollMax * 0.5, scrollMax],
          ['#003287', '#003D9E', '#004AB3', '#0057C7', '#0063D7', '#006DE4', '#1C83ED']
        )}
      />
    </>
  )
}

/** Main component */
export default function Main() {
  // This tiny spring right here controlls all(!) the animations, one for scroll, the other for mouse movement ...
  const [{ top, mouse }, set] = useSpring(() => ({ top: 0, mouse: [0, 0] }))
  const onMouseMove = useCallback(({ clientX: x, clientY: y }) => set({ mouse: [x - window.innerWidth / 2, y - window.innerHeight / 2] }), [])
  const onScroll = useCallback(e => set({ top: e.target.scrollTop }), [])
  return (
    <>
      <Canvas className="canvas">
        <Provider store={store}>
          <ConnectedRouter history={history}>
            {/* place ConnectedRouter under Provider */}
            <>
              <Switch>
                <Route exact path="/" render={() => <Intro top={top} mouse={mouse} />} />
                <Route exact path="/test2" render={() => <Test top={top} mouse={mouse} />} />
                <Route render={() => <div>Miss</div>} />
              </Switch>
            </>
          </ConnectedRouter>
        </Provider>
      </Canvas>
      <div className="scroll-container" onScroll={onScroll} onMouseMove={onMouseMove}>
        <div style={{ height: '1025vh' }} />
      </div>
    </>
  )
}

ReactDOM.render(<Main />, document.getElementById('root'))
