import {config} from './config.js';
import {Wall} from './Wall.js';
import {Cars} from './Cars.js';
import {resources} from './loader.js';
import {levels} from './levels.js'

var _ = require('lodash');
var world = config.world,
renderer = config.renderer,
stage = config.stage,
container = config.container;

var carTexture,
wheelTexture,
graphics,
chassisBody,
player,
cars=[],
menuText = {},
menuSpriteY;

var playing = false,
    inMenu = true;

//only initialize when all textures are loaded
PIXI.loader.once('complete',init);

//make this work
//I should have listened in math class
function explode(point, force){
  this.point = []
  this.point[0] = point[0]/config.zoom
  this.point[1] = -point[1]/config.zoom

  let testgraphics = new PIXI.Graphics();
  testgraphics.beginFill(0xFFFFFF);
  testgraphics.drawCircle(0, 0, 1.5)
  container.addChild(testgraphics);

  this.body = new p2.Body({
           mass: 0,
           position: this.point,
           angle: 0,
           velocity: [0, 0],
           angularVelocity: 0,
           collisionResponse:false
       });
  this.body.addShape(new p2.Circle({ radius: 2 }));
  world.addBody(this.body);

  this.body.fixedX = true;
  this.body.fixedY = true;
  this.body.onCollision = (e) =>{
    console.log(e, this.point)
    let target = e.position;
    let bomb = this.point;
    let distance = p2.vec2.distance(e.position, this.point)
    let direction =[]
    p2.vec2.sub(direction,target, bomb)
    direction[0] = (direction[0]/distance)*force
    direction[1] = (direction[1]/distance)*force
    console.log(direction)
    e.applyImpulse(direction)

  }
  testgraphics.position.x = this.body.position[0];
  testgraphics.position.y = this.body.position[1];

  window.setTimeout(() => {
    world.removeBody(this.body);
    container.removeChild(testgraphics);}, 33)
}

function init(){

  renderer.backgroundColor = 0x040404;
  PIXI.scaleModes.DEFAULT = PIXI.scaleModes.NEAREST;
  var text = new PIXI.Text('MEGA ALPHA EDITION',{font : '24px Arial', fill : 0xFFFFFF, align : 'center'});
  text.x = 20;
  text.y = 20;
  stage.addChild(text)

  stage.addChild(container);
  document.body.appendChild(renderer.view);
  // Add transform to the container
  container.position.x =  0; // center at origin
  container.position.y =  0;
  container.scale.x =  config.zoom;  // zoom in
  container.scale.y = -config.zoom; // Note: we flip the y axis to make "up" the physics "up"

  menuText.play = new PIXI.Text('Play',{font : '24px Arial', fill : 0xFFFFFF, align : 'center'});
  menuText.play.x = renderer.width/2 - menuText.play.width/2;
  menuText.play.y = 400;
  stage.addChild(menuText.play)

  menuText.sprite = new PIXI.Sprite(resources.MenuArrow.texture);
  menuText.sprite.width = 16;
  menuText.sprite.height = 16;
  menuText.sprite.x = menuText.play.x - 20;
  menuSpriteY = menuText.sprite.y = menuText.play.y + 5;
  stage.addChild(menuText.sprite)

  menuText.title = new PIXI.Text('Parky Park Park',{font : '24px Arial', fill : 0xFFFFFF, align : 'center'});
  menuText.title.x = renderer.width/2 - menuText.title.width/2;
  menuText.title.y = 200;
  stage.addChild(menuText.title)

  menuText.sub = new PIXI.Text('Wow',{font : '30px Arial', fill : 0xFFFF00, align : 'center'});
  menuText.sub.x = menuText.title.x + menuText.title.width - menuText.sub.width/2;
  menuText.sub.y = menuText.title.y + menuText.title.height;
  menuText.sub.rotation=100
  stage.addChild(menuText.sub)
  // TODO: give everything onCollision functions
  world.on("impact",function(evt){
    let bodyA = evt.bodyA,
    bodyB = evt.bodyB;
    if(bodyA.onCollision){
      bodyA.onCollision(bodyB);
    }
    if(bodyB.onCollision){
      bodyB.onCollision(bodyA);
    }
  });

  var keys = {
    '37': 0, // left
    '39': 0, // right
    '38': 0, // up
    '40': 0, // down
    '13': 0 //enter
  };

  //this magic number though
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
    if (playing) {player.chassisBody.frontWheel.steerValue = maxSteer * (keys[37] - keys[39]);
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
    if(keys[38]){
      new explode([400,300], 5)
    }
  } else if(inMenu && keys[13]){
    playing = true;
    inMenu = false;
    for (var text in menuText) {
      if (menuText.hasOwnProperty(text)) {
        menuText[text].alpha = 0;
      }
    }
    levels.test.load(levels.test.texture)
    var car = _.sample(Cars)
    player =  new car();
  }
  }

  animate();
}

// Animation loop
function animate(t){
  t = t || 0;
  requestAnimationFrame(animate);

  if (playing) {
    world.step(1/60);
    player.update();
    if(p2.vec2.length(player.chassisBody.velocity) <= 0.05){
      player.chassisBody.backWheel.setBrakeForce(2);
      player.boxShape.collisionGroup = config.CAR;
      cars.push(player);
      var car = _.sample(Cars)
      player =  new car();

    }
    for (var i = cars.length - 1; i >= 0; i--) {
      cars[i].update()
    };
  } else if(inMenu) {

    if((t/2000)%1 <= 0.5){
      menuText.sub.scale.x = 1.5-(t/2000)%1
      menuText.sub.scale.y = 1.5-(t/2000)%1
    } else {
      menuText.sub.scale.x = 0.5+(t/2000)%1
      menuText.sub.scale.y = 0.5+(t/2000)%1
    }

    let menuSpriteThing= (t/25)%28

    if(menuSpriteThing < 14){
      menuText.sprite.height = 16-menuSpriteThing
      menuText.sprite.y = menuSpriteY + menuSpriteThing/2
    } else {
      menuText.sprite.height = 2+menuSpriteThing-14
      menuText.sprite.y = menuSpriteY +14 - menuSpriteThing/2
    }

  }

  renderer.render(stage);
}
