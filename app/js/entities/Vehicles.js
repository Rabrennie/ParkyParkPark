import resources from '../loader.js';
import Car from './Car.js'
import Truck from './Truck.js'
const _ = require('lodash');


export class RedCar extends Car {
  constructor(opts={}) {
    const defaults = { texture: resources.RedCar.texture };
    super(_.defaults(_.clone(opts, true), defaults))
  }
}

export class BlueCar extends Car {
  constructor(opts={}) {
    const defaults = { texture: resources.BlueCar.texture };
    super(_.defaults(_.clone(opts, true), defaults))
  }
}

export class GreenCar extends Car {
  constructor(opts={}) {
    const defaults = { texture: resources.GreenCar.texture };
    super(_.defaults(_.clone(opts, true), defaults))
  }
}

export class OrangeCar extends Car {
  constructor(opts={}) {
    const defaults = { texture: resources.OrangeCar.texture };
    super(_.defaults(_.clone(opts, true), defaults))
  }
}

export class RedStripeCar extends Car {
  constructor(opts={}) {
    const defaults = { texture: resources.RedStripeCar.texture };
    super(_.defaults(_.clone(opts, true), defaults))
  }
}

export class OrangeTruck extends Truck {
  constructor(opts={}) {
    const defaults = { texture: resources.OrangeTruck.texture };
    super(_.defaults(_.clone(opts, true), defaults))
  }
}
