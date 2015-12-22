import {config} from './config.js';

export function Explosion(point, force, radius){
  this.point = []
  this.point[0] = point[0]/config.zoom
  this.point[1] = point[1]/config.zoom

  let testgraphics = new PIXI.Graphics();
  testgraphics.beginFill(0xFFFFFF);
  testgraphics.drawCircle(0, 0, radius-0.5)

  this.body = new p2.Body({
           mass: 0,
           position: this.point,
           angle: 0,
           velocity: [0, 0],
           angularVelocity: 0,
           collisionResponse:false
       });
  this.body.addShape(new p2.Circle({ radius: radius }));

  this.body.onCollision = (e) =>{
    let target = e.position;
    let bomb = this.point;
    let distance = p2.vec2.distance(e.position, this.point)
    let direction =[]
    p2.vec2.sub(direction,target, bomb)
    direction[0] = (direction[0]/distance)*force
    direction[1] = (direction[1]/distance)*force
    e.applyImpulse(direction)
  }

  testgraphics.position.x = this.body.position[0];
  testgraphics.position.y = this.body.position[1];

  this.explode = () => {
    config.world.addBody(this.body);
    config.container.addChild(testgraphics);
    window.setTimeout(() => {
      config.world.removeBody(this.body);
      config.container.removeChild(testgraphics);}, 33)
  }

}
