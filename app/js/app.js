import config from './config.js'
import { Wall } from './Wall.js'
import resources from './loader.js'
import { Explosion } from './Explosion.js'
import { Bomb } from './Bomb.js'
import { MainMenu } from './Menu.js'
import { key, setKey } from './Input.js'
import gamestate from './gamestate'
import Valet from './gamemodes/valet'

var _ = require('lodash')
var world = config.world,
  renderer = config.renderer,
  stage = config.stage,
  container = config.container

var carTexture,
  wheelTexture,
  graphics,
  chassisBody

// only initialize when all textures are loaded
PIXI.loader.once('complete', init)

function init () {
  let test = renderer.view
  test.onclick = e => {
    if (gamestate.playing) {
      new Bomb(e.offsetX, -e.offsetY)
    }
  }
  renderer.backgroundColor = 0x040404
  PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST

  stage.addChild(container)
  document.body.appendChild(renderer.view)
  // Add transform to the container
  container.position.x = 0 // center at origin
  container.position.y = 0
  container.scale.x = config.zoom // zoom in
  container.scale.y = -config.zoom; // Note: we flip the y axis to make "up" the physics "up"

  const menu = new MainMenu()
  gamestate.menus.push(menu)
  stage.addChild(menu)

  // TODO: give everything onCollision functions
  world.on('impact', function (evt) {
    let bodyA = evt.bodyA,
      bodyB = evt.bodyB,
      shapeA = evt.shapeA,
      shapeB = evt.shapeB

    if (bodyA.onCollision) {
      bodyA.onCollision(bodyB, shapeA, bodyB === gamestate.player.chassisBody)
    }
    if (bodyB.onCollision) {
      bodyB.onCollision(bodyA, shapeB, bodyA === gamestate.player.chassisBody)
    }
  })

  window.addEventListener('keydown', evt => {
    setKey(evt.keyCode, 1)
    onInputChange()
  })
  window.addEventListener('keyup', evt => {
    setKey(evt.keyCode, 0)
    onInputChange()
  })

  function onInputChange () {
    if (key['escape']) {
      // TODO: Toggle the menu
      return
    }

    if (gamestate.playing) {
      gamestate.player.onInput()
      return
    }

    for (let i = gamestate.menus.length - 1; i > -1; i--) {
      let { _playing, done, _level } = gamestate.menus[i].onInputChange(gamestate.menus) || {}

      if (_playing !== undefined) {
        gamestate.playing = _playing
        gamestate.level = _level
        gamestate.level.load()
        break
      }

      if (done) break
    }

    if (gamestate.menus.length === 0) {
      gamestate.playing = true
    }
  }

  requestAnimationFrame(Valet.loop)
}
