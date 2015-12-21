import {config} from './config.js';
import {resources} from './loader.js';
var _ = require('lodash');

//TODO Make this a class

class BaseCar {
  constructor(opts = {}) {
  const defaults = {x:50,
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
              collisionMask:config.PLAYER | config.CAR | config.WALL,
              wheelTexture:resources.wheel.texture
  }

  opts = _.defaults(opts, defaults)
  this.chassisBody = new p2.Body({
    position: [opts.x/config.zoom,opts.y/config.zoom],
    mass: opts.mass,
    angle: opts.angle,
    velocity: [opts.velX, opts.velY],
  });

  this.chassisBody.onCollision = body => {
    this.setSideFriction(3,3)
    if(body.shapes[0].collisionGroup == config.WALL){
      window.setTimeout(() => this.setSideFriction(200,200), 100)
    }
  }


  this.setSideFriction = function(front, back) {
    this.chassisBody.frontWheel.setSideFriction(front);
    this.chassisBody.backWheel.setSideFriction(back);
  }

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
    this.graphics.addChild(this.wheelSprite[i]);
    this.wheelSprite[i].scale.x = 0.016
    this.wheelSprite[i].scale.y = 0.016
    this.wheelSprite[i].anchor = new PIXI.Point(1,0.5)

  };
  //FL
  this.wheelSprite[0].position={x:-0.25, y:0.15}
  this.boxShape1 = new p2.Box({ width: this.wheelSprite[0].width, height: this.wheelSprite[0].height });

  this.boxShape1.anchor = new PIXI.Point(1,0.5)
  this.boxShape1.position[0] = -0.25
  this.boxShape1.position[1] = 0.15
  this.chassisBody.addShape(this.boxShape1);

  //FR
  this.wheelSprite[1].position={x:0.4-this.wheelSprite[1].width, y:0.15}

  //BL
  this.wheelSprite[2].position={x:-0.25, y:-0.35}
  //BR
  this.wheelSprite[3].position={x:0.4-this.wheelSprite[3].width, y:-0.35}
  this.sprite = new PIXI.Sprite(opts.texture);
  this.graphics.addChild(this.sprite);

  this.graphics.drawRect(-this.boxShape.width/2, -this.boxShape.height/2, this.boxShape.width, this.boxShape.height);
  this.sprite.width = -this.boxShape.width;
  this.sprite.height = -this.boxShape.height;
  this.sprite.position={x:-this.boxShape.width/2, y:this.boxShape.height/2}
  this.sprite.scale.x = -this.sprite.scale.x


  //wheel sprites


  // Add the box to our container
  opts.container.addChild(this.graphics);

  this.update = function(){
    this.graphics.position.x = this.chassisBody.position[0];
    this.graphics.position.y = this.chassisBody.position[1];
    this.graphics.rotation =   this.chassisBody.angle;
  }
  }
}

class BlueCar extends BaseCar {
  constructor(opts={}) {
    const defaults = {x:50,
                y:-200,
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
                texture:resources.BlueCar.texture,
                collisionMask:config.PLAYER | config.CAR | config.WALL,
                wheelTexture:resources.wheel.texture
    }

    opts = _.defaults(opts, defaults)
    super(opts)
  }
}
let Cars = {}
Cars.BlueCar = BlueCar;
Cars.BaseCar = BaseCar
export {Cars}
