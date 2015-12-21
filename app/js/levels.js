import {config} from './config.js';
import {Wall} from './Wall.js';

class Level {
  constructor(name,walls) {
    this.name = name;
    this.walls = walls
  }
  load(){
    for (var i = 0; i < this.walls.length; i++) {
      this.walls[i].load()
    }
  }
}

const levels = {}
levels.test = new Level("Test",[new Wall(800,-300,20,600,0,config.container,config.world),
                new Wall(400,0,800,20,0,config.container,config.world),
                new Wall(400,-600,800,20,0,config.container,config.world),
                new Wall(0,-300,20,600,0,config.container,config.world)
              ])



export {levels}
