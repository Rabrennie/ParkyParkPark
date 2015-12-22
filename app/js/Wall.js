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

  this.load = function(){
    this.world.addBody(this.wallBody);
  }

}
