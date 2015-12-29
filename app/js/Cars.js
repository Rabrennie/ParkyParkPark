import config from './config.js';
import resources from './loader.js';
import {Explosion} from './Explosion.js'
import {key} from './Input.js'
import {screenShake} from './ScreenShake.js'

var _ = require('lodash');

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
  collisionMask:config.PLAYER | config.CAR | config.TRUCKBACK |config.WALL | config.BOMB | config.EXPLOSION,
  wheelTexture:resources.wheel.texture,
  wheelPositions: [{x:-0.25, y:0.15}, {x:0.4-0.048, y:0.15},{x:-0.25, y:-0.35}, {x:0.4-0.048, y:-0.35}]
};

class BaseCar {

  update() {
    this.graphics.position.x = this.chassisBody.position[0];
    this.graphics.position.y = this.chassisBody.position[1];
    this.graphics.rotation =   this.chassisBody.angle;

    // Check if we should (still) display the Hit Effects
    if (this.hitFrames > 0) {
      this.hitFrames--
      this.hitSprite.alpha = this.hitFrames > 0 ? (this.hitFrames / 10) + 0.6 : 0
    }
  };

  setSideFriction(front, back) {
    this.chassisBody.frontWheel.setSideFriction(front);
    this.chassisBody.backWheel.setSideFriction(back);
  }

  onInput() {
    const maxSteer = 20000;
    const left = key('left')
    const right = key('right')

    this.chassisBody.frontWheel.steerValue = maxSteer * (left - right);
    this.wheelSprite[0].rotation = this.wheelSprite[1].rotation = 0.5 * (left - right);
    this.chassisBody.backWheel.setBrakeForce(0);
    if (key('down')) {
      if(this.chassisBody.backWheel.getSpeed() > 0.1){
        // Moving forward - add some brake force to slow down
        this.chassisBody.backWheel.setBrakeForce(2);
      } else {
        // Moving backwards - reverse the engine force
        this.chassisBody.backWheel.setBrakeForce(2);
      }
    }
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

    this.chassisBody.onCollision = (body, otherShape, playerHit) => {
      this.setSideFriction(3,3);

      if (playerHit) {
        screenShake(6, 6)
      }

      if(body.shapes[0].collisionGroup == config.WALL){
        window.setTimeout(() => this.setSideFriction(200,200), 100)
      } else if (playerHit) {
        // Display the hit effect
        this.hitFrames = 6
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
    this.sprite.position={x:-this.boxShape.width/2, y:this.boxShape.height/2};
    this.sprite.scale.x = -this.sprite.scale.x;


    this.hitFrames = 0
    // "Extra" Sprite for displaying on-hit graphics
    this.hitSprite = new PIXI.Sprite(
        opts.texture === resources.OrangeTruck.texture
        ? resources.TruckHit.texture
        : resources.CarHit.texture
    );
    this.graphics.addChild(this.hitSprite);
    this.hitSprite.width = -this.boxShape.width;
    this.hitSprite.height = -this.boxShape.height;
    this.hitSprite.position={x:-this.boxShape.width/2, y:this.boxShape.height/2};
    this.hitSprite.scale.x = -this.hitSprite.scale.x;
    this.hitSprite.alpha = 0

    opts.container.addChild(this.graphics);

    this.update();
  }
}

class BaseTruck extends BaseCar {
  constructor(opts={}) {
    const defaults = {texture:resources.OrangeTruck.texture,
      w:0.7,
      h:1.075,
      //TODO: fix wheel positions
      wheelPositions: [{x:-0.26, y:0.32}, {x:0.40-0.058, y:0.32},{x:-0.35, y:0}, {x:0.5-0.058, y:0},{x:-0.35, y:-0.38}, {x:0.5-0.058, y:-0.38}],
      mass: 5,
      collisionGroup: config.PLAYER};
    opts = _.defaults(opts, defaults);
    super(opts)
    this.exploded = false;

    this.chassisBody.removeShape(this.boxShape);
    this.boxShape = new p2.Box({ width: opts.w-0.1, height: opts.h-0.675 });
    this.boxShape.collisionGroup = opts.collisionGroup;
    this.boxShape.collisionMask = opts.collisionMask;
    this.chassisBody.addShape(this.boxShape);
    this.boxShape.position[0] = 0
    this.boxShape.position[1] = 0.3

    this.boxShapeBack = new p2.Box({ width: opts.w * 0.9, height: (opts.h-0.4) * 0.92});
    this.boxShapeBack.collisionGroup = config.TRUCKBACK;
    this.boxShapeBack.collisionMask = opts.collisionMask;
    this.chassisBody.addShape(this.boxShapeBack);
    this.boxShapeBack.position[0] = 0
    this.boxShapeBack.position[1] = -0.2

    // this.graphics.drawRect(this.boxShapeBack.position[0]-this.boxShapeBack.width/2, this.boxShapeBack.position[1]-this.boxShapeBack.height/2, this.boxShapeBack.width, this.boxShapeBack.height);

    this.chassisBody.onCollision = (body, shape, playerHit) => {
      const bodyMomentum = [body.velocity[0] * body.mass, body.velocity[1] * body.mass]
      const thisMomentum = [this.chassisBody.velocity[0] * this.chassisBody.mass,
                            this.chassisBody.velocity[1] * this.chassisBody.mass]

      if (playerHit) {
        screenShake(6, 8)
      }

      // Explosion tigger sensitivity
      if (shape.collisionGroup == config.TRUCKBACK && this.exploded == false &&
           (p2.vec2.length(bodyMomentum) > 6.1 ||
            p2.vec2.length(thisMomentum) > 6.1)) {
        this.explosion = new Explosion([this.chassisBody.position[0]*config.zoom,this.chassisBody.position[1]*config.zoom], 8, 2);
        this.explosion.explode();
        this.sprite.texture = resources.RektTruck.texture;
        this.sprite.height = -this.sprite.height
        this.sprite.x = this.sprite.width/2;

        this.exploded = true;
      }

      this.setSideFriction(3,3);
      if(body.shapes[0].collisionGroup == config.WALL){
        window.setTimeout(() => this.setSideFriction(200,200), 100)
      } else if (playerHit) {
        // Display the hit effect
        this.hitFrames = 4
      }
    };

  }
}

export class RedCar extends BaseCar {
  constructor(opts={}) {
    const defaults = {texture:resources.RedCar.texture};
    let options = _.defaults(_.clone(opts, true), defaults);
    super(options)
  }
}

export class BlueCar extends BaseCar {
  constructor(opts={}) {
    const defaults = {texture:resources.BlueCar.texture};
    let options = _.defaults(_.clone(opts, true), defaults);
    super(options)
  }
}

export class GreenCar extends BaseCar {
  constructor(opts={}) {
    const defaults = {texture:resources.GreenCar.texture};
    let options = _.defaults(_.clone(opts, true), defaults);
    super(options)
  }
}

export class OrangeCar extends BaseCar {
  constructor(opts={}) {
    const defaults = {texture:resources.OrangeCar.texture};
    let options = _.defaults(_.clone(opts, true), defaults);
    super(options)
  }
}

export class RedStripeCar extends BaseCar {
  constructor(opts={}) {
    const defaults = {texture:resources.RedStripeCar.texture};
    let options = _.defaults(_.clone(opts, true), defaults);
    super(options)
  }
}

export class OrangeTruck extends BaseTruck {
  constructor(opts={}) {
    const defaults = {texture:resources.OrangeTruck.texture};
    let options = _.defaults(_.clone(opts, true), defaults);
    super(options)
  }
}
