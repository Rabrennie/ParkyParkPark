import config from './config.js';
import { screenShake } from './ScreenShake.js'

export class Wall {
  constructor(x,y,w,h,angle,container,world) {
    this.wallBody = new p2.Body({
      position: [x / config.zoom, y / config.zoom],
      mass: 0,
      angle
    });

    this.wallBody.onCollision = (body, otherShape, playerHit) => {
      if (playerHit) {
        screenShake(6, 6)
      }
    };

    this.world = world;
    this.container = container;

    this.boxShape = new p2.Box({ width: w / config.zoom, height: h / config.zoom });
    this.boxShape.collisionGroup = config.WALL;
    this.boxShape.collisionMask = config.PLAYER | config.CAR | config.TRUCKBACK;
    this.wallBody.addShape(this.boxShape);

    this.graphics = new PIXI.Graphics();
    this.graphics.beginFill(0xff0000);

    this.graphics.drawRect(-this.boxShape.width / 2, -this.boxShape.height / 2, this.boxShape.width, this.boxShape.height);

    this.graphics.position.x = this.wallBody.position[0];
    this.graphics.position.y = this.wallBody.position[1];
  }

  load(debug) {
    this.world.addBody(this.wallBody);
    if (debug) {
      this.container.addChild(this.graphics);
    }
  }
}
