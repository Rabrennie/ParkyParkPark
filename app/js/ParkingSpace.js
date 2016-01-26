import config from './config.js';
import resources from './loader.js';
const _ = require('lodash')


export class ParkingSpace {
  constructor(opts = {}) {
    const defaults = {
      x: 300,
      y: -400,
      angle: 0,
      scaleX: 0.6,
      scaleY: 0.6,
      world:config.world,
      container:config.container,
      collisionGroup:config.PARKING,
      stage:config.stage,
      texture:resources.ParkingSpace.texture
    }
    this.opts = _.defaults(opts, defaults);
    this.body = new p2.Body({
      position: [config.scaleFactorX * opts.x/config.zoom,config.scaleFactorY * opts.y/config.zoom],
      mass: 0,
      angle: opts.angle,
      sensor:true
    });

    this.body._entity = this


    this.texture = opts.texture;
    this.graphics = new PIXI.Graphics();
    this.sprite = new PIXI.Sprite(this.texture);
    this.sprite.scale.x = config.scaleFactorX * opts.scaleX/config.zoom;
    this.sprite.scale.y = config.scaleFactorY * opts.scaleY/config.zoom;
    this.sprite.x = this.sprite.x + this.sprite.width/2
    this.sprite.y = this.sprite.y + this.sprite.height/2
    this.sprite.rotation =3.14159
    this.boxShape = new p2.Box({ width: this.sprite.width, height: this.sprite.height });
    this.boxShape.collisionGroup = config.SCORE;
    this.boxShape.collisionMask = config.CAR | config.TRUCKBACK
    this.boxShape.collsionResponse = false
    this.body.addShape(this.boxShape);
  }

  load() {

    this.graphics.addChild(this.sprite);
    this.opts.container.addChild(this.graphics);
    this.graphics.position.x = this.body.position[0];
    this.graphics.position.y = this.body.position[1];
    this.graphics.rotation =   this.body.angle;
  }

  debug(toggle) {
    if (!toggle) {
      this.graphics.clear()
      this.sprite.alpha = 1
      return
    }

    this.graphics.beginFill(0xff0000);
    this.graphics.drawRect(-this.boxShape.width / 2, -this.boxShape.height / 2, this.boxShape.width, this.boxShape.height);
    this.sprite.alpha = 0.6
  }

  // TODO: add functionality to calculate what car is parked and by how much
  getParked() {
    this.opts.world.addBody(this.body);
  }

  // TODO: make this return an actual score based on the percentage overlap
  getScore() {
    return 1;
  }
}
