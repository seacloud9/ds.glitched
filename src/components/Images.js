import React from 'react'
import data from '../data'
import Image from './Image'
import { interpolate } from 'react-spring/three'
/** This component creates a bunch of parallaxed images */
function Images({ top, mouse, scrollMax, offset }) {
  return data.map(([url, x, y, factor, z, scale], index) => (
    <Image
      key={index}
      url={url}
      rotation={[0,0,0]}
      scale={scale}
      opacity={top.interpolate([0, 500], [0, 1])}
      position={interpolate([top, mouse], (top, mouse) => [
        (-mouse[0] * factor) / offset + x,
        (mouse[1] * factor) / offset + y * 1.15 + ((top * factor) / scrollMax) * 2,
        z + top / offset
      ])}
    />
  ))
}

export default Images
