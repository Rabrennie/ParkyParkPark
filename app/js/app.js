var Car = require('./car.js'),
    config = require('./config');

var carTexture,
    wheelTexture,
    PLAYER=Math.pow(2,1),
    CAR=Math.pow(2,2),
    WALL=Math.pow(2,3);

var renderer, stage, container, graphics, zoom,
world, boxShape, boxBody, planeBody, planeShape,chassisBody,player, cars=[],wall=[];

init();


//TODO Move this to own file and make a class
function Wall(x,y,w,h,angle,container,world){
  this.wallBody = new p2.Body({
    position: [x/config.zoom,y/config.zoom],
    mass: 0,
    angle: angle,
  });

  this.boxShape = new p2.Box({ width: w/config.zoom, height: h/config.zoom });
  this.boxShape.collisionGroup = WALL;
  this.boxShape.collisionMask = PLAYER | CAR ;
  this.wallBody.addShape(this.boxShape);
  world.addBody(this.wallBody);
  this.graphics = new PIXI.Graphics();
  this.graphics.beginFill(0xff0000);

  this.graphics.drawRect(-this.boxShape.width/2, -this.boxShape.height/2, this.boxShape.width, this.boxShape.height);

  this.graphics.position.x = this.wallBody.position[0];
  this.graphics.position.y = this.wallBody.position[1];

  container.addChild(this.graphics);

}

function init(){

  // Init p2.js
  // Create a dynamic body for the chassis
  world = new p2.World({
    gravity : [0,0]
  });
  // Initialize the stage
  renderer =  PIXI.autoDetectRenderer(800, 600),
  stage = new PIXI.Stage(0x282B2A);
  renderer.backgroundColor = 0x282B2A;
  container = new PIXI.Container(),
  PIXI.scaleModes.DEFAULT = PIXI.scaleModes.NEAREST;
  var text = new PIXI.Text('MEGA ALPHA EDITION',{font : '24px Arial', fill : 0xFFFFFF, align : 'center'});
  text.x = 20;
  text.y = 20;
  stage.addChild(text)
  PIXI.loader
  .add('car', 'assets/car1.png')
  .add('wheel', 'assets/wheel.png')
  .load(function (loader, resources) {
    carTexture = resources.car.texture;
    wheelTexture = resources.wheel.texture;
    wall[0] = new Wall(800,-300,20,600,0,container,world)
    wall[1] = new Wall(400,0,800,20,0,container,world)
    wall[2] = new Wall(400,-600,800,20,0,container,world)
    wall[4] = new Wall(0,-300,20,600,0,container,world)

    player = new Car(50,-30,0.5,0.875,-1.5708,15,0,2,world,container,PLAYER,stage,carTexture,PLAYER | CAR | WALL,wheelTexture);
    animate();
  });
  stage.addChild(container);
  document.body.appendChild(renderer.view);
  // Add transform to the container
  container.position.x =  0; // center at origin
  container.position.y =  0;
  container.scale.x =  config.zoom;  // zoom in
  container.scale.y = -config.zoom; // Note: we flip the y axis to make "up" the physics "up"

  world.on("impact",function(evt){
    var bodyA = evt.bodyA,
    bodyB = evt.bodyB;

    if(bodyA.shapes[0].collisionGroup == CAR || bodyA.shapes[0].collisionGroup == PLAYER) {
      bodyA.frontWheel.setSideFriction(3);
      bodyA.backWheel.setSideFriction(3);
    }
    if(bodyB.shapes[0].collisionGroup == CAR || bodyB.shapes[0].collisionGroup == PLAYER) {
      bodyB.frontWheel.setSideFriction(3);
      bodyB.backWheel.setSideFriction(3);
    }

    if(bodyB.shapes[0].collisionGroup == WALL && bodyA.shapes.collisionGroup == PLAYER) {
      window.setTimeout(function(){
        bodyA.frontWheel.setSideFriction(200);
        bodyA.backWheel.setSideFriction(200);}, 100)
      }
      if(bodyA.shapes[0].collisionGroup == WALL && bodyB.shapes.collisionGroup == PLAYER) {
        window.setTimeout(function(){
          bodyB.frontWheel.setSideFriction(200);
          bodyB.backWheel.setSideFriction(200);}, 100)
        }


      });0



      // Draw the box.


      var keys = {
        '37': 0, // left
        '39': 0, // right
        '38': 0, // up
        '40': 0 // down
      };
      var maxSteer = 20000;
      window.addEventListener("keydown",function (evt){
        keys[evt.keyCode] = 1;
        onInputChange();
      });
      window.addEventListener("keyup",function (evt){
        keys[evt.keyCode] = 0;
        onInputChange();
      });
      function onInputChange(){
        // Steer value zero means straight forward. Positive is left and negative right.
        player.chassisBody.frontWheel.steerValue = maxSteer * (keys[37] - keys[39]);
        player.wheelSprite[0].rotation = player.wheelSprite[1].rotation = 0.5*(keys[37] - keys[39])
        player.chassisBody.backWheel.setBrakeForce(0);
        if(keys[40]){
          if(player.chassisBody.backWheel.getSpeed() > 0.1){
            // Moving forward - add some brake force to slow down
            player.chassisBody.backWheel.setBrakeForce(2);
          } else {
            // Moving backwards - reverse the engine force
            player.chassisBody.backWheel.setBrakeForce(2);
          }
        }
      }
    }

    // Animation loop
    function animate(t){
      t = t || 0;
      requestAnimationFrame(animate);

      // Move physics bodies forward in time
      world.step(1/60);

      // Transfer positions of the physics objects to Pixi.js

      player.update();
      for (var i = cars.length - 1; i >= 0; i--) {
        cars[i].update()
      };
      // console.log(p2.vec2.length(player.chassisBody.velocity))
      if(p2.vec2.length(player.chassisBody.velocity) <= 0.05){
        player.chassisBody.backWheel.setBrakeForce(2);
        player.boxShape.collisionGroup = CAR;
        cars.push(player);
        player = new Car(50,-30,0.5,0.875,-1.5708,15,0,2,world,container,PLAYER,stage,carTexture,PLAYER | CAR | WALL,wheelTexture);

      }
      // Render scene
      renderer.render(stage);
    }
