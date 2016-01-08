import config from '../config.js';
import Menu from './Menu.js'
import { key } from '../Input.js'
import variant from '../variants.js'
import * as levels from '../levels.js'

var _ = require('lodash');

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
    this.levels = []

    _.forOwn(levels, (value, key) => {
      this.levels.push(key);
    });

    this.curLevel = _.indexOf(this.levels, variant.level.name)

    const tLevels = this.levels;
    let curLevel = this.curLevel

    this.addOption(`Level: ${this.levels[this.curLevel]}`, {
      state: {
        active: false
      },
      onInputChange() {

        console.log(tLevels)
        if(key('right')) {
          curLevel += 1;
          if (curLevel === tLevels.length) {
            curLevel = 0;
          }
        }
        if(key('left')) {
          curLevel -= 1;
          if (curLevel === -1) {
            curLevel = tLevels.length-1;
          }
        }
        variant.level = levels[tLevels[curLevel]];
        this.textObj.text = `Level: ${tLevels[curLevel]}`;
      }
    })


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
