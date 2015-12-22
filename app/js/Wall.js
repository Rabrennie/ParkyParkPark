import {config} from './config.js';

//TODO make this a class

export function Wall(x,y,w,h,angle,container,world){
  this.wallBody = new p2.Body({
    position: [x/config.zoom,y/config.zoom],
    mass: 0,
    angle: angle,
  });

  this.wallBody.onCollision = body => {
    let a = body;
  }

  this.world = world;
  this.container = container;

  this.boxShape = new p2.Box({ width: w/config.zoom, height: h/config.zoom });
  this.boxShape.collisionGroup = config.WALL;
  this.boxShape.collisionMask = config.PLAYER | config.CAR ;
  this.wallBody.addShape(this.boxShape);

  this.graphics = new PIXI.Graphics();
  this.graphics.beginFill(0xff0000);

  this.graphics.drawRect(-this.boxShape.width/2, -this.boxShape.height/2, this.boxShape.width, this.boxShape.height);

  this.graphics.position.x = this.wallBody.position[0];
  this.graphics.position.y = this.wallBody.position[1];

  this.load = function(debug){
    this.world.addBody(this.wallBody);
    if(debug){
      this.container.addChild(this.graphics);
    }

  }

}
