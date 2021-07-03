import React, { useMemo } from 'react'
import { useThree } from 'react-three-fiber'
import { a } from 'react-spring/three'
//import './Text.css'
const font = require("../assets/fonts/Road_Rage.ttf")
const neonFont = new FontFace('Road Rage', `url(${font})`);

neonFont.load().then(function(loadedFont) {
  document.fonts.add(loadedFont)
}).catch(function(error) {
  console.log('Failed to load font: ' + error)
})

/** This renders text via canvas and projects it as a sprite */

function Text({ children, position, opacity, color = 'white', fontSize = 300 }) {
  const {
    size: { width, height },
    viewport: { width: viewportWidth, height: viewportHeight }
  } = useThree()
  const scale = viewportWidth > viewportHeight ? viewportWidth : viewportHeight
  const canvas = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = 2048
    const context = canvas.getContext('2d')
    
    context.font = `${fontSize}px 'Road Rage'`
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    var grd = context.createLinearGradient(0,0,0,canvas.width);
    grd.addColorStop(0,"#FF00BF");
    grd.addColorStop(0.3,"#DFFF00");
    grd.addColorStop(0.6,"#470E6B");
    grd.addColorStop(0.1,"#FF00BF");
    
    context.fillStyle = grd;
    context.fillText(children, 1024, 1024 - 410 / 2)
    return canvas
  }, [children, width, height, color, fontSize])

  return (
    <a.sprite scale={[scale / 2, scale / 2, 1]} position={position}>
      <a.spriteMaterial attach="material" transparent opacity={opacity}>
        <canvasTexture attach="map" image={canvas} premultiplyAlpha onUpdate={s => (s.needsUpdate = true)} />
      </a.spriteMaterial>
    </a.sprite>
  )
}

export default Text
