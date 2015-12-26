import config from './config.js';
import {Explosion} from './Explosion.js'

export class Bomb {
  constructor(x,y){
    this.body = new p2.Body({
         mass: 0,
         position: [x/config.zoom, y/config.zoom],
         angle: 0,
         velocity: [0, 0],
         angularVelocity: 0,
         collisionResponse:false
     });
    this.body.addShape(new p2.Circle({ radius: 1 }));
    this.body.shapes[0].collisionGroup = config.BOMB;
    this.body.shapes[0].collisionMask = config.PLAYER | config.CAR ;

    this.graphics= new PIXI.Graphics();
    this.graphics.beginFill(0xFFFFFF);
    this.graphics.drawCircle(0, 0, 0.5);
    this.graphics.position.x = this.body.position[0];
    this.graphics.position.y = this.body.position[1];
    config.world.addBody(this.body);
    config.container.addChild(this.graphics);
    this.body.onCollision = (e) =>{
      config.world.removeBody(this.body);
      config.container.removeChild(this.graphics);
      this.explosion.explode();
    };
    this.explosion = new Explosion([x,y], 8, 2);

  }
}
