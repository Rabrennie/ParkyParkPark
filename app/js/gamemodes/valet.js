import GameMode from './_gamemode';
import config from '../config';
import gamestate from '../gamestate';
import { shakeUpdate } from '../ScreenShake.js'
import * as Cars from '../entities/Vehicles.js';

import _ from 'lodash';

export default class Valet extends GameMode {
  static loop() {

    shakeUpdate()

    // TODO: Have a gameloop function. Maybe have a seperate one for each gametype
    if (gamestate.playing) {
      // TODO: do initialization better somehow?
      if (!gamestate.player) {
        const Car = _.sample(Cars);
        const spawn = _.sample(gamestate.level.spawnPoints);

        gamestate.player = new Car(spawn);
      }
      gamestate.player.update();

      if (p2.vec2.length(gamestate.player.body.velocity) <= 0.05) {
        gamestate.player.body.backWheel.setBrakeForce(2);
        gamestate.player.boxShape.collisionGroup = config.CAR;
        gamestate.cars.push(gamestate.player);
        const Car = _.sample(Cars);
        const spawn = _.sample(gamestate.level.spawnPoints);
        gamestate.player = new Car(spawn);
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
