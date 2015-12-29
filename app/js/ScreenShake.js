import config from './config.js'
const Random = require('random-js')
const mt = Random.engines.mt19937()
mt.autoSeed()


var shakeStrength = 20
var shakeFrames = 0

export function screenShake(frames, strength) {
  shakeFrames = frames || 20
  shakeStrength = strength || 20
}

export function shakeUpdate() {
  // Screen Shake
  if (shakeFrames > 0) {
    const magnitude = (shakeFrames / shakeStrength) * shakeStrength * config.screenShake
    const x = Random.integer(-magnitude, magnitude)(mt)
    const y = Random.integer(-magnitude, magnitude)(mt)
    console.log(x, y)

    config.stage.position.x = x
    config.stage.position.y = y
    shakeFrames--
  } else {
    config.stage.position.x = 0
    config.stage.position.y = 0
  }
}
