import config from './config.js';
import { Wall } from './Wall.js';
import resources from './loader.js';
import { ParkingSpace } from './ParkingSpace.js'

class Level {
  constructor(name,texture) {
    this.name = name;
    this.walls = [];
    this.graphics = new PIXI.Graphics();
    this.graphics.beginFill(0xff0000);
    this.graphics.width = 800;
    this.graphics.height = 600;
    this.texture = texture;
    this.spawnPoints = [];
    this.parkingSpaces = []

    for (var i = 0; i < 24; i++) {
      this.parkingSpaces.push(new ParkingSpace({ x:Math.floor(Math.random() * 700) + 300, y:Math.floor(Math.random() * -500) -50  , angle: Math.floor(Math.random() * (Math.PI*2)) }))

    }
  }

  load() {

    this.sprite = new PIXI.Sprite(resources[this.texture].texture);
    this.sprite.position.x = 0/config.zoom;
    this.sprite.position.y = -600/config.zoom;
    this.sprite.scale.x = 1/config.zoom;
    this.sprite.scale.y = 1/config.zoom;
    this.graphics.addChild(this.sprite);
    config.container.addChild(this.graphics);

    for (let i = 0; i < this.walls.length; i++) {
      this.walls[i].load();
    }
    for (let i = 0; i < this.parkingSpaces.length; i++) {
      this.parkingSpaces[i].load();
    }
  }

  addWall(x,y,w,h,angle,container = config.container,world = config.world) {
    this.walls.push(new Wall(x,y,w,h,angle,container,world));
  }

  addSpawn(x,y,velX = 15,velY = 0) {
    this.spawnPoints.push({ x, y, velX, velY })
  }
}

export class test extends Level {
  constructor() {
    super('Test', 'TestLevel')
    this.addWall(800,-300,20,600,0);
    this.addWall(400,0,800,20,0);
    this.addWall(400,-600,800,20,0);
    this.addWall(400,-600,800,20,0);
    this.addWall(101,-565,199,70,0);
    this.addWall(101,-35,199,70,0);
    this.addWall(101,-300,203,333,0);

    this.addSpawn(-20, -95);
    this.addSpawn(-20, -500)
  }
}
