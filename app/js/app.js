import config from './config.js';
import {Wall} from './Wall.js';
import * as Cars from './Cars.js';
import resources from './loader.js';
import {levels} from './levels.js';
import {Explosion} from './Explosion.js'
import {Bomb} from './Bomb.js'
import {MainMenu} from './Menu.js'

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
cars=[]
const menus = []

var playing = false,
    inMenu = true;

//only initialize when all textures are loaded
PIXI.loader.once('complete',init);

function init(){
  let test = renderer.view;
  test.onclick = e => {
    if(playing) {
      new Bomb(e.offsetX,-e.offsetY)
    }
  };
  renderer.backgroundColor = 0x040404;
  PIXI.scaleModes.DEFAULT = PIXI.scaleModes.NEAREST;

  stage.addChild(container);
  document.body.appendChild(renderer.view);
  // Add transform to the container
  container.position.x =  0; // center at origin
  container.position.y =  0;
  container.scale.x =  config.zoom;  // zoom in
  container.scale.y = -config.zoom; // Note: we flip the y axis to make "up" the physics "up"

  const menu = new MainMenu()
  menus.push(menu)
  stage.addChild(menu)


  // TODO: give everything onCollision functions
  world.on("impact",function(evt){
    let bodyA = evt.bodyA,
        bodyB = evt.bodyB,
        shapeA = evt.shapeA,
        shapeB = evt.shapeB;

    if(bodyA.onCollision){
      bodyA.onCollision(bodyB, shapeA, bodyB === player.chassisBody);
    }
    if(bodyB.onCollision){
      bodyB.onCollision(bodyA, shapeB, bodyA === player.chassisBody);
    }
  });


  //INPUT STUFF
  // TODO: Add gamepad support
  var keys = {
    '37': 0, // left
    '39': 0, // right
    '38': 0, // up
    '40': 0, // down
    '13': 0 //enter
  };

  window.addEventListener("keydown",function (evt){
    keys[evt.keyCode] = 1;
    onInputChange();
  });
  window.addEventListener("keyup",function (evt){
    keys[evt.keyCode] = 0;
    onInputChange();
  });

  function onInputChange(){

    if (playing) {
      player.onInput(keys);
    } else if(inMenu && keys[13]) {
      playing = true;
      inMenu = false;

      menus.splice(menus.indexOf(menu))
      stage.removeChild(menu)

      levels.test.load(levels.test.texture);
      var car = _.sample(Cars);
      player =  new car();
      new Bomb(300,-300)
    }
  }

  animate();
}

// Animation loop
function animate(t){
  t = t || 0;
  //TODO: Have a gameloop function. Maybe have a seperate one for each gametype
  if (playing) {
    player.update();
    if(p2.vec2.length(player.chassisBody.velocity) <= 0.05){
      player.chassisBody.backWheel.setBrakeForce(2);
      player.boxShape.collisionGroup = config.CAR;
      cars.push(player);
      var car = _.sample(Cars);
      player =  new car();

    }
    for (let i = cars.length - 1; i >= 0; i--) {
      cars[i].update()
    }
  } else if(inMenu) {
    //TODO: Give menu it's own update function

    for (let i = menus.length - 1; i > -1; i--) {
      menus[i].update(t)
    }
  }

  requestAnimationFrame(animate);
  world.step(1/60);
  renderer.render(stage);
}
