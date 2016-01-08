import config from '../config.js';
import Menu from './Menu.js'
import gamestate from '../gamestate.js'
import Valet from '../gamemodes/valet.js'
import OptionsMenu from './OptionsMenu.js'
import VariantMenu from './VariantMenu.js'
import variant from '../variants.js'

export default class MainMenu extends Menu {
  constructor() {
    super({ optsOffset:300 })

    const renderer = config.renderer

    this._options = [];
    this.selectedOption = 0;

    this.addOption('Play', (menus) => {
      menus.splice(menus.indexOf(this))
      config.stage.removeChild(this)
      gamestate.mode = new Valet();
      gamestate.carsLeft = 24;
      return { _playing: true, _level: new variant.level() };
    });

    this.addOption('Change Variants', (menus) => {

      const newMenu = new VariantMenu()
      menus.push(newMenu)
      config.stage.addChild(newMenu)

      return
    });


    this.addOption('Options', (menus) => {

      const newMenu = new OptionsMenu()
      menus.push(newMenu)
      config.stage.addChild(newMenu)

      return
    });

    this._title = new PIXI.Text('Parky Park Park',{ font : '24px Arial', fill : 0xFFFFFF, align : 'center' })
    this._title.x = renderer.width/2 - this._title.width/2
    this._title.y = 200
    this.addChild(this._title)

    this._splash = new PIXI.Text('Wow',{ font : '30px Arial', fill : 0xFFFF00, align : 'center' })
    this._splash.x = this._title.x + this._title.width - this._splash.width/2
    this._splash.y = this._title.y + this._title.height
    this._splash.rotation = 100
    this.addChild(this._splash)
  }

  update(now, delta) {
    super.update(now, delta)
    this._title.x = config.renderer.width/2 - this._title.width/2;
    this._title.y = 200*config.scaleFactorY;
    this._title.style = { font : 24*config.scaleFactorX + 'px Arial', fill : 0xFFFFFF, align : 'center' };

    this._splash.x = this._title.x + this._title.width - this._splash.width/2
    this._splash.y = this._title.y + this._title.height

    if ((now / 2000) % 1 <= 0.5) {
      this._splash.scale.x = 1.5 - (now / 2000) % 1
      this._splash.scale.y = 1.5 - (now / 2000) % 1
    } else {
      this._splash.scale.x = 0.5 + (now / 2000) % 1
      this._splash.scale.y = 0.5 + (now / 2000) % 1
    }
  }
}
