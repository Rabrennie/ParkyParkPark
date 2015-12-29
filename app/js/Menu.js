import resources from './loader.js'
import config from './config.js'
import * as levels from './levels.js'
import * as Cars from './Cars.js';
import {key} from './Input.js'
import {screenShake} from './ScreenShake.js'

//TODO: Refactor this so there is less repeated text
class Menu extends PIXI.Container {
  constructor() {
    super()
    this._options = [];
    this.selectedOption = 0;

    this._background = new PIXI.Sprite(resources.Default.texture)
    this._background.width = config.renderer.width
    this._background.height = config.renderer.height
    this._background.tint = 0x040404
    this.addChild(this._background)

    this._text = new PIXI.Text('MEGA ALPHA EDITION',{font : '24px Arial', fill : 0xFFFFFF, align : 'center'})
    this._text.x = 20
    this._text.y = 20
    this.addChild(this._text)

    this._pointer = new PIXI.Sprite(resources.MenuArrow.texture)
    this._pointer.width = 16
    this._pointer.height = 16
    this._pointer.visible = false
    this.addChild(this._pointer)
  }

  // XXX(Fishrock123) onInputChange MUST be a *regular* function so it can inherit scope
  addOption(text, opts={}){
    let i = this._options.length;

    if (typeof opts === 'function') {
      opts = { callback: opts }
    }

    this._options.push(new Option(opts.callback, opts.onInputChange, opts.update, opts.state));
    this._options[i].textObj = new PIXI.Text(text,{font : '24px Arial', fill : 0xFFFFFF, align : 'center'});
    this._options[i].textObj.x = config.renderer.width/2 - this._options[i].textObj.width/2;
    this._options[i].textObj.y = 400 + 50*i;
    this.addChild(this._options[i].textObj);

    // Load pointer
    if (i === 0) {
      this._pointer.visible = true
      this._pointer.x = this._options[0].textObj.x - 20
      this.menuSpriteY = this._pointer.y = this._options[0].textObj.y + 5
    }
  }

  // Can be implemented in submenus
  // Return API:
  //
  // Do nothing: `return`
  // Prevent inputChange from reaching other menus (below, earlier in `menus`):
  //   `return { done: true }``
  // Tell the game it should (Boolean) playing: `return { _playing: <boolean> }`
  //
  onInputChange(menus){
    if (key('down')) {
      this.selectedOption += 1;
      if(this.selectedOption == this._options.length){
        this.selectedOption = 0;
      }
      const option = this._options[this.selectedOption]
      this._pointer.x = option.textObj.x - 20
      this.menuSpriteY = this._pointer.y = option.textObj.y + 5
      return { done: true }
    }

    if (key('up')) {
      this.selectedOption -= 1;
      if(this.selectedOption == -1){
        this.selectedOption = this._options.length-1;
      }
      const option = this._options[this.selectedOption]
      this._pointer.x = option.textObj.x - 20
      this.menuSpriteY = this._pointer.y = option.textObj.y + 5
      return { done: true }
    }

    const option = this._options[this.selectedOption]
    if (key('enter') && option.callback) {
      return option.callback(menus);
    }

    if (option.onInputChange) {
      option.onInputChange()
    }

    return
  }

  update(now, delta) {
    const option = this._options[this.selectedOption]
    if (option.update) {
      option.update(now, delta)
    }

    const menuSpriteThing = (now / 25) % 28

    if (menuSpriteThing < 14) {
      this._pointer.height = 16 - menuSpriteThing
      this._pointer.y = this.menuSpriteY + menuSpriteThing / 2
    } else {
      this._pointer.height = 2 + menuSpriteThing - 14
      this._pointer.y = this.menuSpriteY + 14 - menuSpriteThing / 2
    }
  }
}

export class KeyMapMenu extends Menu {
  constructor(){
    super()
    this.addOption('Back', (menus) => {
      menus.splice(menus.indexOf(this))
      config.stage.removeChild(this)

      return { done: true };
    })
  }
}

export class OptionsMenu extends Menu {
  constructor(){
    super()
    this.addOption(`Master Volume: ${config.masterVolume * 100}%`, {
      state: {
        accumulator: 0
      },
      update(now, delta) {
        this.state.accumulator += delta
        if (this.state.accumulator < 100) return
        this.state.accumulator = 0

        /// "this" scope is the actual Option
        if (key('left')) {
          if ((config.masterVolume -= 0.05) < 0) config.masterVolume = 0

          if (config.masterVolume === 0) {
            this.textObj.text = 'Master Volume: 0%'
          } else {
            this.textObj.text = `Master Volume: ${Math.round(config.masterVolume * 100)}%`
          }
        }
        if (key('right')) {
          if ((config.masterVolume += 0.05) > 1) config.masterVolume = 1
            this.textObj.text = `Master Volume: ${Math.round(config.masterVolume * 100)}%`
        }
      }
    })
    this.addOption(`Screen Shake: ${config.screenShake * 100}%`, {
      state: {
        accumulator: 0
      },
      update(now, delta) {
        this.state.accumulator += delta
        if (this.state.accumulator < 100) return
        this.state.accumulator = 0

        /// "this" scope is the actual Option
        if (key('left')) {
          if ((config.screenShake -= 0.05) < 0) config.screenShake = 0

          if (config.screenShake === 0) {
            this.textObj.text = 'Screen Shake: None'
          } else {
            this.textObj.text = `Screen Shake: ${Math.round(config.screenShake * 100)}%`
          }
          screenShake()
        }
        if (key('right')) {
          if ((config.screenShake += 0.05) > 2) config.screenShake = 2

          if (config.screenShake === 2) {
            this.textObj.text = 'Screen Shake: Vlambeer'
          } else {
            this.textObj.text = `Screen Shake: ${Math.round(config.screenShake * 100)}%`
          }
          screenShake()
        }
      }
    })
    this.addOption('Key Mapping', (menus) => {
      const newMenu = new KeyMapMenu()
      menus.push(newMenu)
      config.stage.addChild(newMenu)

      return
    })

    this.addOption('Back', (menus) => {
      menus.splice(menus.indexOf(this))
      config.stage.removeChild(this)

      return { done: true };
    })
  }
}

export class MainMenu extends Menu {
  constructor() {
    super()

    const renderer = config.renderer

    this._options = [];
    this.selectedOption = 0;

    this.addOption("Play", (menus) => {
      menus.splice(menus.indexOf(this))
      config.stage.removeChild(this)



      return { _playing: true, _level: levels.test };
    });

    this.addOption("Options", (menus) => {

      const newMenu = new OptionsMenu()
      menus.push(newMenu)
      config.stage.addChild(newMenu)

      return
    });

    this._title = new PIXI.Text('Parky Park Park',{font : '24px Arial', fill : 0xFFFFFF, align : 'center'})
    this._title.x = renderer.width/2 - this._title.width/2
    this._title.y = 200
    this.addChild(this._title)

    this._splash = new PIXI.Text('Wow',{font : '30px Arial', fill : 0xFFFF00, align : 'center'})
    this._splash.x = this._title.x + this._title.width - this._splash.width/2
    this._splash.y = this._title.y + this._title.height
    this._splash.rotation = 100
    this.addChild(this._splash)
  }

  update(now, delta) {
    super.update(now, delta)

    if ((now / 2000) % 1 <= 0.5) {
      this._splash.scale.x = 1.5 - (now / 2000) % 1
      this._splash.scale.y = 1.5 - (now / 2000) % 1
    } else {
      this._splash.scale.x = 0.5 + (now / 2000) % 1
      this._splash.scale.y = 0.5 + (now / 2000) % 1
    }
  }
}

// Let the compiler optimize a bit
function Option(callback, onInputChange, update, state) {
  this.callback = callback
  this.onInputChange = onInputChange
  this.update = update
  this.state = state
  this.textObj = null
}
