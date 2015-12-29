
import GameMode from './_gamemode';
import config from '../config';
import gamestate from '../gamestate';
import {shakeUpdate} from '../ScreenShake.js'
import * as Cars from '../Cars.js';

import _ from 'lodash';

let lastTime = 0;

export default class Valet {
  static loop(now) {
    const delta = now - lastTime;
    lastTime = now

    // Only update the topmost (last) (currently "active") menu layer
    if (gamestate.menus.length > 0) {
      gamestate.menus[gamestate.menus.length - 1].update(now, delta)
    }

    shakeUpdate()

    //TODO: Have a gameloop function. Maybe have a seperate one for each gametype
    if (gamestate.playing) {
      // TODO: do initialization better somehow?
      if (!gamestate.player) {
        var car = _.sample(Cars);
        let spawn = _.sample(gamestate.level.spawnPoints);

        gamestate.player =  new car(spawn);
      }
      gamestate.player.update();

      if (p2.vec2.length(gamestate.player.chassisBody.velocity) <= 0.05) {
        gamestate.player.chassisBody.backWheel.setBrakeForce(2);
        gamestate.player.boxShape.collisionGroup = config.CAR;
        gamestate.cars.push(gamestate.player);
        var car = _.sample(Cars);
        let spawn = _.sample(gamestate.level.spawnPoints);
        gamestate.player =  new car(spawn);
      }

      for (let i = gamestate.cars.length - 1; i >= 0; i--) {
        gamestate.cars[i].update()
      }
    }

    requestAnimationFrame(Valet.loop);
    if (gamestate.playing) config.world.step(1/60);
    config.renderer.render(config.stage);
  }
}
