import config from '../config.js';
const _ = require('lodash');

const defaults = {
  x    : 0,
  y    : 0,
  angle: 0,
  velX : 0,
  velY : 0,
  mass : 1,
}

export default class Entity {

  constructor(opts={}) {
    opts = _.defaults(opts, defaults);

    this.body = new p2.Body({
      position: [opts.x/config.zoom,opts.y/config.zoom],
      mass: opts.mass,
      angle: opts.angle,
      velocity: [opts.velX, opts.velY]
    });
    config.world.addBody(this.body);

    this.body._entity = this

    this.graphics = new PIXI.Graphics();
    opts.container.addChild(this.graphics);

    this.hitFrames = 0

    this.update();
  }

  update() {
    this.graphics.position.x = this.body.position[0];
    this.graphics.position.y = this.body.position[1];
    this.graphics.rotation =   this.body.angle;

    // Check if we should (still) display the Hit Effects
    if (this.hitFrames > 0) {
      this.hitFrames--
      this.hitSprite.alpha = this.hitFrames > 0 ? (this.hitFrames / 10) + 0.6 : 0
    }
  }

  // Implement in subclasses
  onInput() {}

}
