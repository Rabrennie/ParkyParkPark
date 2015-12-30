import config from './config.js';
import { Wall } from './Wall.js';
import resources from './loader.js';

class Level {
  constructor(name,walls,texture, spawnPoints) {
    this.name = name;
    this.walls = walls;
    this.graphics = new PIXI.Graphics();
    this.graphics.beginFill(0xff0000);
    this.graphics.width = 800;
    this.graphics.height = 600;
    this.texture = texture;
    this.spawnPoints = spawnPoints;
  }

  load() {

    this.sprite = new PIXI.Sprite(resources[this.texture].texture);
    this.sprite.position.x = 0/config.zoom;
    this.sprite.position.y = -600/config.zoom;
    this.sprite.scale.x = 1/config.zoom;
    this.sprite.scale.y = 1/config.zoom;
    this.graphics.addChild(this.sprite);
    config.container.addChild(this.graphics);

    for (var i = 0; i < this.walls.length; i++) {
      this.walls[i].load();
    }
  }
}

export const test = new Level('Test',[
  new Wall(800,-300,20,600,0,config.container,config.world),
  new Wall(400,0,800,20,0,config.container,config.world),
  new Wall(400,-600,800,20,0,config.container,config.world),
  new Wall(400,-600,800,20,0,config.container,config.world),
  new Wall(101,-565,199,70,0,config.container,config.world),
  new Wall(101,-35,199,70,0,config.container,config.world),
  new Wall(101,-300,203,333,0,config.container,config.world)
], 'TestLevel',[{ x:-20,y:-95 }, { x:-20,y:-500 }]);
