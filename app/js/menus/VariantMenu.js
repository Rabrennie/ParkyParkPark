import config from '../config.js';
import Menu from './Menu.js'
import { key } from '../Input.js'
import variant from '../variants.js'
import * as levels from '../levels.js'
export default class VariantMenu extends Menu {
  constructor() {
    super({
      optsOffset: 200,
      optsAlign: 'left',
    })

    const renderer = config.renderer

    this._title = new PIXI.Text('Options',{ font : '24px Arial', fill : 0xFFFFFF, align : 'center' })
    this._title.x = renderer.width/2 - this._title.width/2
    this._title.y = 100
    this.addChild(this._title)

    this.addOption(`Level: ${variant.level.name}`)


    this.addOption('Back', (menus) => {
      menus.splice(menus.indexOf(this))
      config.stage.removeChild(this)

      return { done: true }
    })
  }
  update(now, delta) {
    super.update(now,delta);
    this._title.x = config.renderer.width/2 - this._title.width/2;
    this._title.style = { font : 24*config.scaleFactorX + 'px Arial', fill : 0xFFFFFF, align : 'center' }

  }
}
