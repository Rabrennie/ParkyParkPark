import config from '../config.js';
import resources from '../loader.js';
import { key } from '../Input.js'
import { screenShake } from '../ScreenShake.js'
import Entity from './Entity.js'
const _ = require('lodash');

const defaults = {
  x:-20,
  y:-95,
  w:0.5,
  h:0.875,
  angle:-1.5708,
  velX:15,
  velY:0,
  mass:1,
  world:config.world,
  container:config.container,
  collisionGroup:config.PLAYER,
  stage:config.stage,
  texture:resources.RedCar.texture,
  collisionMask:config.PLAYER | config.CAR | config.TRUCKBACK | config.WALL | config.BOMB | config.EXPLOSION,
  wheelTexture:resources.wheel.texture,
  wheelPositions: [
    { x:-0.22, y:0.24 },
    { x:0.4-0.098, y:0.24 },
    { x:-0.22, y:-0.30 },
    { x:0.4-0.098, y:-0.3 }
  ]
};

export default class Car extends Entity {

  constructor(opts = {}) {
    // fix so wheels show
    defaults.wheelTexture = resources.wheel.texture;
    opts = _.defaults(opts, defaults);
    super(opts)

    this.body.onCollision = (body, otherShape, playerHit) => {
      this.setSideFriction(3,3);

      if (playerHit) {
        screenShake(6, 6)
      }

      if (body.shapes[0].collisionGroup === config.WALL) {
        window.setTimeout(() => this.setSideFriction(200,200), 100)
      } else if (playerHit) {
        // Display the hit effect
        this.hitFrames = 6
      }
    };


    this.boxShape = new p2.Box({ width: opts.w, height: opts.h });
    this.boxShape.collisionGroup = opts.collisionGroup;
    this.boxShape.collisionMask = opts.collisionMask;
    this.body.addShape(this.boxShape);
    // Create the vehicle
    this.vehicle = new p2.TopDownVehicle(this.body);
    // Add one front wheel and one back wheel - we don't actually need four :)

    this.body.frontWheel = this.vehicle.addWheel({
      localPosition: [0, 0.5] // front
    });

    this.body.frontWheel.setSideFriction(200);

    // Back wheel
    this.body.backWheel = this.vehicle.addWheel({
      localPosition: [0, -0.5] // back
    });
    this.body.backWheel.setSideFriction(200); // Less side friction on back wheel makes it easier to drift
    this.vehicle.addToWorld(opts.world);

    this.wheelSprite = [];


    for (var i = opts.wheelPositions.length-1; i >= 0; i--) {
      this.wheelSprite[i] = new PIXI.Sprite(opts.wheelTexture);
      this.wheelSprite[i].scale.x = 0.016;
      this.wheelSprite[i].scale.y = 0.016;
      this.wheelSprite[i].anchor = new PIXI.Point(1,0.5)
      this.wheelSprite[i].position = opts.wheelPositions[i]
      this.graphics.addChild(this.wheelSprite[i]);
    }

    this.sprite = new PIXI.Sprite(opts.texture);
    this.graphics.addChild(this.sprite);
    this.sprite.width = -this.boxShape.width;
    this.sprite.height = -this.boxShape.height;
    this.sprite.position={ x:-this.boxShape.width/2, y:this.boxShape.height/2 };
    this.sprite.scale.x = -this.sprite.scale.x;

    // "Extra" Sprite for displaying on-hit graphics
    this.hitSprite = new PIXI.Sprite(
        opts.texture === resources.OrangeTruck.texture
        ? resources.TruckHit.texture
        : resources.CarHit.texture
    );
    this.graphics.addChild(this.hitSprite);
    this.hitSprite.width = -this.boxShape.width;
    this.hitSprite.height = -this.boxShape.height;
    this.hitSprite.position={ x:-this.boxShape.width/2, y:this.boxShape.height/2 };
    this.hitSprite.scale.x = -this.hitSprite.scale.x;
    this.hitSprite.alpha = 0
  }

  setSideFriction(front, back) {
    this.body.frontWheel.setSideFriction(front);
    this.body.backWheel.setSideFriction(back);
  }

  onInput() {
    const maxSteer = 20000;
    const left = key('steerLeft')
    const right = key('steerRight')

    this.body.frontWheel.steerValue = maxSteer * (left - right);
    this.wheelSprite[0].rotation = this.wheelSprite[1].rotation = 0.5 * (left - right);
    this.body.backWheel.setBrakeForce(0);
    if (key('brake')) {
      if(this.body.backWheel.getSpeed() > 0.1) {
        // Moving forward - add some brake force to slow down
        this.body.backWheel.setBrakeForce(2);
      } else {
        // Moving backwards - reverse the engine force
        this.body.backWheel.setBrakeForce(2);
      }
    }
  }

  debug(toggle) {
    if (!toggle) {
      this.graphics.clear()
      this.sprite.alpha = 1
      return
    }

    this.graphics.beginFill(0xFF0000)
    this.graphics.drawRect(-this.boxShape.width / 2, -this.boxShape.height / 2, this.boxShape.width, this.boxShape.height);
    this.sprite.alpha = 0.6
  }
}
