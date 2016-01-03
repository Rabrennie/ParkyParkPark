import gamestate from './gamestate'
import config from './config'

let lastTime = 0;

export default function menuLoop(now, _loop) {
  const delta = now - lastTime;
  lastTime = now

  if (gamestate.menus.length > 0) {
    gamestate.menus[gamestate.menus.length - 1].update(now, delta)
  }
  
  requestAnimationFrame(_loop)
  config.renderer.render(config.stage);
}
