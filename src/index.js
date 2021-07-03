import ReactDOM from 'react-dom'
import React, { useRef } from 'react'
import { Provider } from 'react-redux'
import { Route, Switch } from 'react-router' // react-router v4/v5
import { ConnectedRouter } from 'connected-react-router'
import configureStore, { history } from './configureStore'
// A THREE.js React renderer, see: https://github.com/drcmda/react-three-fiber
import { Canvas } from 'react-three-fiber'
// A React animation lib, see: https://github.com/react-spring/react-spring
import { useSpring, a, animated, config } from 'react-spring/three'
import './styles.css'
import ShaderBackground from './components/ShaderBackground'
import Effects from './components/Effects'
import Text from './components/Text'
import VoxelVader from './components/VoxelVader'
const store = configureStore()

function Demo({ top, mouse }) {
  const ref = useRef()
  const [{ pos }, set, start] = useSpring(() => ({
    to:{pos: [0,0,5]},
    from: {pos: [0,0,-20]},
    config: config.molasses,
    loop:true
  }))
  return (
    <>
      <Effects factor={0.4} />
      <Text>
        D3M0SC3NE
      </Text>
      <animated.group ref={ref} position={pos}>
        <VoxelVader position={[2.5,0,0]} />
        <VoxelVader position={[-0.5,0,0]} />
        <VoxelVader position={[-2.5,0,0]} />
      </animated.group>
      <ShaderBackground />
    </>
  )
}



/** Main component */
export default function Main() {
  return (
    <>
      <Canvas className="canvas">
        <Provider store={store}>
          <ConnectedRouter history={history}>
            {/* place ConnectedRouter under Provider */}
            <>
              <Switch>
                <Route exact path="/" render={() => <Demo  />} />
                <Route render={() => <div>Miss</div>} />
              </Switch>
            </>
          </ConnectedRouter>
        </Provider>
      </Canvas>
      <div className="scroll-container" >
      </div>
    </>
  )
}

ReactDOM.render(<Main />, document.getElementById('root'))
