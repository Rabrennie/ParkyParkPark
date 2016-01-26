import config from './config.js';
import { Wall } from './Wall.js';
import resources from './loader.js';
import { ParkingSpace } from './ParkingSpace.js'
const Random = require('random-js')
const mt = Random.engines.mt19937()
mt.autoSeed()


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
  }

  load() {

    this.sprite = new PIXI.Sprite(resources[this.texture].texture);
    this.sprite.position.x = 0/config.zoom;
    this.sprite.position.y = -config.H/config.zoom;
    this.sprite.scale.x = config.scaleFactorX*1/config.zoom;
    this.sprite.scale.y = config.scaleFactorY*1/config.zoom;
    this.graphics.addChild(this.sprite);
    config.container.addChild(this.graphics);

    for (let i = 0; i < this.walls.length; i++) {
      this.walls[i].load(true);
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

  addParkingSpace(x, y, angle) {
    this.parkingSpaces.push(new ParkingSpace({ x, y, angle }))
  }

  debug(toggle) {
    for (let i = 0; i < this.walls.length; i++) {
      this.walls[i].debug(toggle)
    }
  }
}

export class Test extends Level {
  constructor() {
    super('Test', 'TestLevel')
    this.addWall(1067,-300,20,600,0);
    this.addWall(583,0,1067,20,0);
    this.addWall(583,-600,1067,20,0);
    this.addWall(583,-600,1067,20,0);
    this.addWall(101,-565,199,70,0);
    this.addWall(101,-35,199,70,0);
    this.addWall(101,-300,203,333,0);
    this.addSpawn(config.scaleFactorX*-20, config.scaleFactorY*-95);
    this.addSpawn(config.scaleFactorX*-20, config.scaleFactorY*-500)

    const up = 0
    const down = 180 * (Math.PI / 180)

    this.sprite = new PIXI.Sprite(resources.ParkingSpace.texture);

    var psOffsetY = this.sprite.height / 1.76 // MAGIC NUMBER DO NOT TOUCH
    var psOffsetX = this.sprite.width / 1.76 // MAGIC NUMBER DO NOT TOUCH

    console.log((config.scaleFactorX*2))

    for (let i = 0; i < 8; i++) {
      this.addParkingSpace((psOffsetX * i + 360), -150, down)
      this.addParkingSpace((psOffsetX * i + 360), -150 - psOffsetY, up)

      this.addParkingSpace((psOffsetX * i + 360), -370, up)
      this.addParkingSpace((psOffsetX * i + 360), -370 + psOffsetY, down)
    }
  }
}

export class Another extends Level {
  constructor() {
    super('Another', '')
    this.addWall(1067,-300,20,600,0);
    this.addSpawn(config.scaleFactorX*-20, config.scaleFactorY*-95);
    this.addSpawn(config.scaleFactorX*-20, config.scaleFactorY*-500)
  }
}
