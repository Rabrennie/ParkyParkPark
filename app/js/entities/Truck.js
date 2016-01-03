import config from '../config.js';
import resources from '../loader.js';
import { Explosion } from '../Explosion.js'
import { screenShake } from '../ScreenShake.js'
import Car from './Car.js'
const _ = require('lodash');

const defaults = { texture:resources.OrangeTruck.texture,
  w:0.7,
  h:1.075,
  wheelPositions: [
    { x:-0.24, y:0.32 },
    { x:0.40-0.078, y:0.32 },
    { x:-0.30, y:0 },
    { x:0.5-0.108, y:0 },
    { x:-0.30, y:-0.38 },
    { x:0.5-0.108, y:-0.38 }
  ],
  mass: 5,
  collisionGroup: config.PLAYER };

export default class Truck extends Car {
  constructor(opts={}) {
    opts = _.defaults(opts, defaults);
    super(opts)
    this.exploded = false;

    this.body.removeShape(this.boxShape);
    this.boxShape = new p2.Box({ width: opts.w-0.1, height: opts.h-0.675 });
    this.boxShape.collisionGroup = opts.collisionGroup;
    this.boxShape.collisionMask = opts.collisionMask;
    this.body.addShape(this.boxShape);
    this.boxShape.position[0] = 0
    this.boxShape.position[1] = 0.3

    this.boxShapeBack = new p2.Box({ width: opts.w * 0.9, height: (opts.h-0.4) * 0.92 });
    this.boxShapeBack.collisionGroup = config.TRUCKBACK;
    this.boxShapeBack.collisionMask = opts.collisionMask;
    this.body.addShape(this.boxShapeBack);
    this.boxShapeBack.position[0] = 0
    this.boxShapeBack.position[1] = -0.2

    this.body.onCollision = (body, shape, playerHit) => {
      const bodyMomentum = [body.velocity[0] * body.mass, body.velocity[1] * body.mass]
      const thisMomentum = [this.body.velocity[0] * this.body.mass,
                            this.body.velocity[1] * this.body.mass]

      if (playerHit) {
        screenShake(6, 8)
      }

      // Explosion tigger sensitivity
      if (shape.collisionGroup === config.TRUCKBACK && this.exploded === false &&
           (p2.vec2.length(bodyMomentum) > 6.1 ||
            p2.vec2.length(thisMomentum) > 6.1)) {
        this.explosion = new Explosion([this.body.position[0]*config.zoom,this.body.position[1]*config.zoom], 8, 2);
        this.explosion.explode();
        this.sprite.texture = resources.RektTruck.texture;
        this.sprite.height = -this.sprite.height
        this.sprite.x = this.sprite.width/2;

        this.exploded = true;
      }

      this.setSideFriction(3,3);
      if(body.shapes[0].collisionGroup === config.WALL) {
        window.setTimeout(() => this.setSideFriction(200,200), 100)
      } else if (playerHit) {
        // Display the hit effect
        this.hitFrames = 4
      }
    };

  }

  debug(toggle) {
    if (!toggle) {
      this.graphics.clear()
      this.sprite.alpha = 1
      return
    }

    this.graphics.beginFill(0xFF0000)
    this.graphics.drawRect(this.boxShape.position[0]-this.boxShape.width/2, this.boxShape.position[1]-this.boxShape.height/2, this.boxShape.width, this.boxShape.height);
    this.graphics.drawRect(this.boxShapeBack.position[0]-this.boxShapeBack.width/2, this.boxShapeBack.position[1]-this.boxShapeBack.height/2, this.boxShapeBack.width, this.boxShapeBack.height);
    this.sprite.alpha = 0.6
  }
}
