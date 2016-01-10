import GameMode from './_gamemode';
import config from '../config';
import gamestate from '../gamestate';
import * as Cars from '../entities/Vehicles.js';
import MainMenu from '../menus/MainMenu.js'

import _ from 'lodash';

export default class Valet extends GameMode {
  constructor(cars) {
    super()

    gamestate.carsLeft = cars

    this.carsLeft = new PIXI.Text('Cars Left: ' + cars,{ font : '24px Arial', fill : 0xFFFFFF, align : 'center' })
    this.carsLeft.x = 0
    this.carsLeft.y = 0
    config.stage.addChildAt(this.carsLeft, config.stage.children.length)

  }
  loop(now, _loop) {
    if (gamestate.playing) {
      // TODO: do initialization better somehow?

      if (!gamestate.player) {
        const Car = _.sample(Cars);
        const spawn = _.sample(gamestate.level.spawnPoints);

        gamestate.player = new Car(spawn);
      }
      gamestate.player.update();

      if (p2.vec2.length(gamestate.player.body.velocity) <= 0.05 &&   gamestate.carsLeft > 0) {
        gamestate.player.body.backWheel.setBrakeForce(2);
        gamestate.player.boxShape.collisionGroup = config.CAR;
        gamestate.cars.push(gamestate.player);
        const Car = _.sample(Cars);
        const spawn = _.sample(gamestate.level.spawnPoints);
        gamestate.player = new Car(spawn);
        gamestate.carsLeft -= 1;
        this.carsLeft.text = 'Cars Left: ' + gamestate.carsLeft
      }

      if (gamestate.carsLeft === 0) {
        gamestate.playing = false;
        // Game ends when there are no cars left.
        // Reset the score so we can calculate it.
        gamestate.score = 0;

        // render the updated carsLeft already
        config.renderer.render(config.stage);

        // do some setup and add the parkingSpaces' bodies to the world
        const psLookup = []

        const parkingSpaces = gamestate.level.parkingSpaces
        for (let i = 0; i < parkingSpaces.length; i++) {
          const body = parkingSpaces[i].body
          body._scores = []
          config.world.addBody(body);
          psLookup.push(body)
        }

        const parkingSpaceCheck = (payload) => {
          // because eslint no-redecale can't handle exclusive if-statement hoisting
          var psBody
          var other
          if (_.contains(psLookup, payload.bodyA)) {
            psBody = payload.bodyA
            other = payload.bodyB
          } else if (_.contains(psLookup, payload.bodyB)) {
            psBody = payload.bodyB
            other = payload.bodyA
          } else {
            console.warn('Unexpected contact')
            console.warn('Entities', payload.bodyA._entity, payload.bodyB._entity)
            return
          }

          // some wild math suggested by schteppe (p2.js Author)
          // This doesn't strictly check for overlap, but rather which body has
          // the deepest penetration. i.e. Has the point on a shape the farthest
          // from the farthest point on the other shape.
          const contactEq = payload.contactEquations[0]
          const penetrationVec = contactEq.penetrationVec
          p2.vec2.add(penetrationVec,contactEq.contactPointB,contactEq.bodyB.position)
          p2.vec2.sub(penetrationVec,penetrationVec,contactEq.bodyA.position)
          p2.vec2.sub(penetrationVec,penetrationVec,contactEq.contactPointA);

          const _score = {
            depth: p2.vec2.dot(contactEq.penetrationVec, contactEq.normalA),
            body: other
          }
          psBody._scores.push(_score)
        }
        // register an on beginContact so we have have P2 tell us which spaces have cars in them
        config.world.on('beginContact', parkingSpaceCheck)

        // Step the world so that P@ can update and create contacts for the parkingSpaces
        config.world.step(1/60)

        // Actually calculate the score based on which vehicle has the most "overlap" for each space.
        _.each(psLookup, (parkingSpace) => {
          var depth = -0.2 // minimum overlap to get score
          var body = null
          _.each(parkingSpace._scores, (_score) => {
            if (_score.depth >= depth) return

            depth = _score.depth
            body = _score.body
          })

          if (!body) return
          gamestate.score += body._entity.score // get score from the entity type
        })

        // reset everything
        config.world.off('beginContact', parkingSpaceCheck)

        config.stage.removeChild(this.carsLeft)
        config.world.clear();
        config.world.gravity = [0,0];
        gamestate.player = null;
        gamestate.menus = [];
        gamestate.cars = []
        gamestate.mode = null;
        const menu = new MainMenu()
        gamestate.menus.push(menu)
        config.stage.addChild(menu)
        console.log(gamestate.score)
        requestAnimationFrame(_loop);
      }

      for (let i = gamestate.cars.length - 1; i >= 0; i--) {
        gamestate.cars[i].update()
      }
    }

    requestAnimationFrame(_loop);
    if (gamestate.playing) config.world.step(1/60);
    config.renderer.render(config.stage);
  }

  debug(toggle) {
    gamestate.level.debug(toggle)
    if (gamestate.player) gamestate.player.debug(toggle)

    for (let i = 0; i < gamestate.cars.length; i++) {
      gamestate.cars[i].debug(toggle)
    }
    for (let i = 0; i < gamestate.level.parkingSpaces.length; i++) {
      gamestate.level.parkingSpaces[i].debug(toggle)
    }
  }
}
