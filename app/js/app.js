import config from './config.js';
import {Wall} from './Wall.js';
import * as Cars from './Cars.js';
import resources from './loader.js';
import {Explosion} from './Explosion.js'
import {Bomb} from './Bomb.js'
import {MainMenu} from './Menu.js'
import {key, setKey} from './Input.js'

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

var playing = false;

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

  window.addEventListener('keydown', evt => {
    setKey(evt.keyCode, 1)
    onInputChange();
  });
  window.addEventListener('keyup', evt => {
    setKey(evt.keyCode, 0)
    onInputChange();
  });

  function onInputChange(){

    if (key['escape']) {
      // TODO: Toggle the menu
      return
    }

    if (playing) {
      player.onInput();
      return
    }

    for (let i = menus.length - 1; i > -1; i--) {
      let { _playing, done } = menus[i].onInputChange(menus) || {}

      if (_playing !== undefined) {
        playing = _playing;
        break;
      }

      if (done) break
    }

    if (menus.length === 0) {
      playing = true
    }
  }

  requestAnimationFrame(animate);
}

// Animation loop
function animate(delta) {

  // Only update the topmost (last) (currently "active") menu layer
  if (menus.length > 0) {
    menus[menus.length - 1].update(delta)
  }

  //TODO: Have a gameloop function. Maybe have a seperate one for each gametype
  if (playing) {
    // TODO: do initialization better somehow?
    if (!player) {
      var car = _.sample(Cars);
      player =  new car();
    }
    player.update();

    if (p2.vec2.length(player.chassisBody.velocity) <= 0.05) {
      player.chassisBody.backWheel.setBrakeForce(2);
      player.boxShape.collisionGroup = config.CAR;
      cars.push(player);
      var car = _.sample(Cars);
      player =  new car();
    }

    for (let i = cars.length - 1; i >= 0; i--) {
      cars[i].update()
    }
  }

  requestAnimationFrame(animate);
  if (playing) world.step(1/60);
  renderer.render(stage);
}
