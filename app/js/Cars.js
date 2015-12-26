import config from './config.js';
import resources from './loader.js';
var _ = require('lodash');

const defaults = {
  x:50,
  y:-50,
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
  collisionMask:config.PLAYER | config.CAR | config.WALL | config.BOMB | config.EXPLOSION,
  wheelTexture:resources.wheel.texture,
  wheelPositions: [{x:-0.25, y:0.15}, {x:0.4-0.048, y:0.15},{x:-0.25, y:-0.35}, {x:0.4-0.048, y:-0.35}]
};

class BaseCar {

  update() {
    this.graphics.position.x = this.chassisBody.position[0];
    this.graphics.position.y = this.chassisBody.position[1];
    this.graphics.rotation =   this.chassisBody.angle;
  };

  setSideFriction(front, back) {
    this.chassisBody.frontWheel.setSideFriction(front);
    this.chassisBody.backWheel.setSideFriction(back);
  }

  constructor(opts = {}) {
    //fix so wheels show
    defaults.wheelTexture = resources.wheel.texture;

    opts = _.defaults(opts, defaults);

    this.chassisBody = new p2.Body({
      position: [opts.x/config.zoom,opts.y/config.zoom],
      mass: opts.mass,
      angle: opts.angle,
      velocity: [opts.velX, opts.velY]
    });

    this.chassisBody.onCollision = body => {
      this.setSideFriction(3,3);
      if(body.shapes[0].collisionGroup == config.WALL){
        window.setTimeout(() => this.setSideFriction(200,200), 100)
      }
    };


    this.boxShape = new p2.Box({ width: opts.w, height: opts.h });
    this.boxShape.collisionGroup = opts.collisionGroup;
    this.boxShape.collisionMask = opts.collisionMask;
    this.chassisBody.addShape(this.boxShape);
    opts.world.addBody(this.chassisBody);
    // Create the vehicle
    this.vehicle = new p2.TopDownVehicle(this.chassisBody);
    // Add one front wheel and one back wheel - we don't actually need four :)

    this.chassisBody.frontWheel = this.vehicle.addWheel({
      localPosition: [0, 0.5] // front
    });

    this.chassisBody.frontWheel.setSideFriction(200);

    // Back wheel
    this.chassisBody.backWheel = this.vehicle.addWheel({
      localPosition: [0, -0.5] // back
    });
    this.chassisBody.backWheel.setSideFriction(200); // Less side friction on back wheel makes it easier to drift
    this.vehicle.addToWorld(opts.world);

    this.graphics = new PIXI.Graphics();
    this.graphics.beginFill(0xff0000);
    this.wheelSprite = [];


    for (var i = 3; i >= 0; i--) {
      this.wheelSprite[i] = new PIXI.Sprite(opts.wheelTexture);
      this.wheelSprite[i].scale.x = 0.016;
      this.wheelSprite[i].scale.y = 0.016;
      this.wheelSprite[i].anchor = new PIXI.Point(1,0.5)
      this.wheelSprite[i].position = opts.wheelPositions[i]
      this.graphics.addChild(this.wheelSprite[i]);
    }

    this.sprite = new PIXI.Sprite(opts.texture);
    this.graphics.addChild(this.sprite);

    // this.graphics.drawRect(-this.boxShape.width/2, -this.boxShape.height/2, this.boxShape.width, this.boxShape.height);
    this.sprite.width = -this.boxShape.width;
    this.sprite.height = -this.boxShape.height;
    this.sprite.position={x:-this.boxShape.width/2, y:this.boxShape.height/2};
    this.sprite.scale.x = -this.sprite.scale.x;

    opts.container.addChild(this.graphics);

    this.update();
  }
}

export class RedCar extends BaseCar {
  constructor(opts={}) {
    const defaults = {texture:resources.RedCar.texture};
    opts = _.defaults(opts, defaults);
    super(opts)
  }
}

export class BlueCar extends BaseCar {
  constructor(opts={}) {
    const defaults = {texture:resources.BlueCar.texture};
    opts = _.defaults(opts, defaults);
    super(opts)
  }
}

export class GreenCar extends BaseCar {
  constructor(opts={}) {
    const defaults = {texture:resources.GreenCar.texture};
    opts = _.defaults(opts, defaults);
    super(opts)
  }
}

export class OrangeCar extends BaseCar {
  constructor(opts={}) {
    const defaults = {texture:resources.OrangeCar.texture};
    opts = _.defaults(opts, defaults);
    super(opts)
  }
}

export class RedStripeCar extends BaseCar {
  constructor(opts={}) {
    const defaults = {texture:resources.RedStripeCar.texture};
    opts = _.defaults(opts, defaults);
    super(opts)
  }
}
