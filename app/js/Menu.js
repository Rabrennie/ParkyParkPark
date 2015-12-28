import resources from './loader.js'
import config from './config.js'
import {levels} from './levels.js'
import * as Cars from './Cars.js';
import {key} from './Input.js'

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

  addOption(text, callback){
    let i = this._options.length;

    this._options.push({
      text:text,
      callback:callback
    });
    this._options[i].textObj = new PIXI.Text(this._options[i].text,{font : '24px Arial', fill : 0xFFFFFF, align : 'center'});
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
    if (key('enter')) {
      return this._options[this.selectedOption].callback(menus);
    }
    if (key('down')) {
      this.selectedOption += 1;
      if(this.selectedOption == this._options.length){
        this.selectedOption = 0;
      }
      this._pointer.x = this._options[this.selectedOption].textObj.x - 20
      this.menuSpriteY = this._pointer.y = this._options[this.selectedOption].textObj.y + 5
      return { done: true }
    }

    if (key('up')) {
      this.selectedOption -= 1;
      if(this.selectedOption == -1){
        this.selectedOption = this._options.length-1;
      }
      this._pointer.x = this._options[this.selectedOption].textObj.x - 20
      this.menuSpriteY = this._pointer.y = this._options[this.selectedOption].textObj.y + 5
      return { done: true }
    }

    return
  }

  update(delta) {
    const menuSpriteThing = (delta / 25) % 28

    if (menuSpriteThing < 14) {
      this._pointer.height = 16 - menuSpriteThing
      this._pointer.y = this.menuSpriteY + menuSpriteThing / 2
    } else {
      this._pointer.height = 2 + menuSpriteThing - 14
      this._pointer.y = this.menuSpriteY + 14 - menuSpriteThing / 2
    }
  }
}

export class TestMenu extends Menu {
  constructor(){
    super()

    this.addOption('Back',(menus) => {
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

      levels.test.load(levels.test.texture);

      return { _playing: true };
    });

    this.addOption("Test Menu", (menus) => {

      const newMenu = new TestMenu()
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

  update(delta) {
    super.update(delta)

    if ((delta / 2000) % 1 <= 0.5) {
      this._splash.scale.x = 1.5 - (delta / 2000) % 1
      this._splash.scale.y = 1.5 - (delta / 2000) % 1
    } else {
      this._splash.scale.x = 0.5 + (delta / 2000) % 1
      this._splash.scale.y = 0.5 + (delta / 2000) % 1
    }
  }

}
