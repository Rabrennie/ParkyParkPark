import gamestate from './gamestate'
import { shakeUpdate } from './ScreenShake.js'
import config from './config'

let lastTime = 0;

export default function menuLoop(now) {
  const delta = now - lastTime;
  lastTime = now
  shakeUpdate()
  if (gamestate.menus.length > 0) {
    gamestate.menus[gamestate.menus.length - 1].update(now, delta)
  }
  config.renderer.render(config.stage);
  if(gamestate.mode !== null) {
    requestAnimationFrame(gamestate.mode.loop);
  } else {
    requestAnimationFrame(menuLoop);
  }
}
