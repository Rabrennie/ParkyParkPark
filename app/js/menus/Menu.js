import resources from '../loader.js'
import config from '../config.js'
import { key } from '../Input.js'

export default class Menu extends PIXI.Container {
  constructor(opts={}) {
    super()
    this._options = [];
    this.selectedOption = 0;
    this.overrideDefaults = false;

    this._background = new PIXI.Sprite(resources.Default.texture)
    this._background.width = config.renderer.width
    this._background.height = config.renderer.height
    this._background.tint = 0x040404
    this.addChild(this._background)

    this._text = new PIXI.Text('MEGA ALPHA EDITION',{ font : '24px Arial', fill : 0xFFFFFF, align : 'center' })
    this._text.x = 20
    this._text.y = 20
    this.addChild(this._text)

    this._pointer = new PIXI.Sprite(resources.MenuArrow.texture)
    this._pointer.width = 16
    this._pointer.height = 16
    this._pointer.visible = false
    this.addChild(this._pointer)

    this.optsOffset = opts.optsOffset || 400
    this.optsAlign = opts.optsAlign || 'center'
  }

  addOption(text, opts={}) {
    const i = this._options.length;

    if (typeof opts === 'function') {
      opts = { callback: opts }
    }

    this._options.push(new Option(opts.callback, opts.onInputChange, opts.update, opts.state));
    this._options[i].textObj = new PIXI.Text(text,{
      font : '24px Arial',
      fill : 0xFFFFFF,
      align : opts.optsAlign });
    if (this.optsAlign === 'left') {
      this._options[i].textObj.x = config.renderer.width/4;
    } else { // i.e. 'center'
      this._options[i].textObj.x = config.renderer.width/2 - this._options[i].textObj.width/2;
    }
    this._options[i].textObj.y = this.optsOffset + 50*i*config.scaleFactorY;
    this.addChild(this._options[i].textObj);

    // Load pointer
    if (i === 0) {
      this._pointer.visible = true
      this._pointer.x = this._options[0].textObj.x - 20*config.scaleFactorX
      this._pointer.y = this._options[0].textObj.y + 5*config.scaleFactorY
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
  // XXX(Fishrock123) onInputChange MUST be a *regular* function so it can inherit scope
  onInputChange(menus) {

    const option = this._options[this.selectedOption]
    // if option.onInputChange returns true then the rest of the input change stuff doesn't get run. Used for keybinding
    if (option.onInputChange) {
      this.overrideDefaults = option.onInputChange()
    }
    if(!this.overrideDefaults) {
      if (key('down')) {
        this.selectedOption += 1;
        if(this.selectedOption === this._options.length) {
          this.selectedOption = 0;
        }
        return { done: true }
      }

      if (key('up')) {
        this.selectedOption -= 1;
        if(this.selectedOption === -1) {
          this.selectedOption = this._options.length-1;
        }
        return { done: true }
      }

      const option = this._options[this.selectedOption]
      if (key('enter') && option.callback) {
        return option.callback(menus);
      }
    }
    return
  }

  update(now, delta) {

    for (var i = 0; i < this._options.length; i++) {
      this._options[i].textObj.style = { font : 24*config.scaleFactorX + 'px Arial', fill : 0xFFFFFF, align : 'center' }
      if (this.optsAlign === 'left') {
        this._options[i].textObj.x = config.renderer.width/4;
      } else { // i.e. 'center'
        this._options[i].textObj.x = config.renderer.width/2 - this._options[i].textObj.width/2;
      }
      this._options[i].textObj.y = (this.optsOffset*config.scaleFactorY) + (50*config.scaleFactorY)*i;

    }

    const option = this._options[this.selectedOption]
    if (option.update) {
      option.update(now, delta)
    }

    const menuSpriteThing = (now / 25) % 28

    if (menuSpriteThing < 14) {
      this._pointer.height = (16 - menuSpriteThing)*config.scaleFactorY;
      this._pointer.y = option.textObj.y + 5*config.scaleFactorY + menuSpriteThing / 2;
    } else {
      this._pointer.height = (2 + menuSpriteThing - 14)*config.scaleFactorY;
      this._pointer.y = option.textObj.y + 5*config.scaleFactorY + 14 - menuSpriteThing / 2
    }


    this._pointer.width = 16*config.scaleFactorX;
    this._pointer.x = option.textObj.x - 20*config.scaleFactorX;
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
