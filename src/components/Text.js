import React, { useMemo } from 'react'
import { useThree } from 'react-three-fiber'
import { a } from 'react-spring/three'
/** This renders text via canvas and projects it as a sprite */
function Text({ children, position, opacity, color = 'white', fontSize = 410 }) {
  const {
    size: { width, height },
    viewport: { width: viewportWidth, height: viewportHeight }
  } = useThree()
  const scale = viewportWidth > viewportHeight ? viewportWidth : viewportHeight
  const canvas = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = 2048
    const context = canvas.getContext('2d')
    context.font = `${fontSize}px "ROAD RAGE"`
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    var grd = context.createLinearGradient(0,0,0,canvas.width);
    grd.addColorStop(0,"#f7ce46");
    grd.addColorStop(0.3,"#f4b63f");
    grd.addColorStop(0.6,"#eb493c");
    grd.addColorStop(0.1,"#ea334a");
    
    context.fillStyle = grd;
    context.fillText(children, 1024, 1024 - 410 / 2)
    return canvas
  }, [children, width, height, color, fontSize])

  return (
    <a.sprite scale={[scale, scale, 1]} position={position}>
      <a.spriteMaterial attach="material" transparent opacity={opacity}>
        <canvasTexture attach="map" image={canvas} premultiplyAlpha onUpdate={s => (s.needsUpdate = true)} />
      </a.spriteMaterial>
    </a.sprite>
  )
}

export default Text
