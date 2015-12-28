import resources from './loader.js'
import config from './config.js'
import {levels} from './levels.js'
import * as Cars from './Cars.js';

//TODO: Refactor this so there is less repeated text
class Menu extends PIXI.Container {
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
  }

  constructor() {
    super()
    this._options = [];
    this.active = true;
    this.selectedOption = 0;
  }

  // Implement these in subclasses
  update(delta = 1) {}
  onInputChange(keys, menus){
    if (this.active) {

      if(keys[13]){
        return this._options[this.selectedOption].callback(menus);
      }
      if(keys[40]){
        this.selectedOption += 1;
        if(this.selectedOption == this._options.length){
          this.selectedOption = 0;
        }
        this._sprite.x = this._options[this.selectedOption].textObj.x - 20
        this.menuSpriteY = this._sprite.y = this._options[this.selectedOption].textObj.y + 5
        return {override:true}
      }

      if(keys[38]){
        this.selectedOption -= 1;
        if(this.selectedOption == -1){
          this.selectedOption = this._options.length-1;
        }
        this._sprite.x = this._options[this.selectedOption].textObj.x - 20
        this.menuSpriteY = this._sprite.y = this._options[this.selectedOption].textObj.y + 5
        return {override:true}
      }

      return {override:true}
    } else {
      return { skip:true }
    }
  }
}

export class TestMenu extends Menu {
  constructor(parent){
    super()

    const renderer = config.renderer

    this._text = new PIXI.Text('MEGA ALPHA EDITION',{font : '24px Arial', fill : 0xFFFFFF, align : 'center'})
    this._text.x = 20
    this._text.y = 20
    this.addChild(this._text)
    this.addOption('Back',(menus) => {
      menus.splice(menus.indexOf(this))
      config.stage.removeChild(this)
      parent.active = true
      parent.visible = true;
      return { override:true };
    } )

    this._sprite = new PIXI.Sprite(resources.MenuArrow.texture)
    this._sprite.width = 16
    this._sprite.height = 16
    this._sprite.x = this._options[0].textObj.x - 20
    this.menuSpriteY = this._sprite.y = this._options[0].textObj.y + 5
    this.addChild(this._sprite)

  }

  update(delta) {
    const menuSpriteThing = (delta / 25) % 28

    if (menuSpriteThing < 14) {
      this._sprite.height = 16 - menuSpriteThing
      this._sprite.y = this.menuSpriteY + menuSpriteThing / 2
    } else {
      this._sprite.height = 2 + menuSpriteThing - 14
      this._sprite.y = this.menuSpriteY + 14 - menuSpriteThing / 2
    }
  }

}

export class MainMenu extends Menu {
  constructor() {
    super()

    const renderer = config.renderer

    this.active = true;

    this._text = new PIXI.Text('MEGA ALPHA EDITION',{font : '24px Arial', fill : 0xFFFFFF, align : 'center'})
    this._text.x = 20
    this._text.y = 20
    this.addChild(this._text)

    this._options = [];
    this.selectedOption = 0;

    this.addOption("Play", (menus) => {
      menus.splice(menus.indexOf(this))
      config.stage.removeChild(this)

      levels.test.load(levels.test.texture);

      return { p: true };
    });

    this.addOption("Test Menu", (menus) => {
      this.active = false;
      this.visible = false;
      return {newMenu:new TestMenu(this)};
    });


    this._sprite = new PIXI.Sprite(resources.MenuArrow.texture)
    this._sprite.width = 16
    this._sprite.height = 16
    this._sprite.x = this._options[0].textObj.x - 20
    this.menuSpriteY = this._sprite.y = this._options[0].textObj.y + 5
    this.addChild(this._sprite)

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
    if ((delta / 2000) % 1 <= 0.5) {
      this._splash.scale.x = 1.5 - (delta / 2000) % 1
      this._splash.scale.y = 1.5 - (delta / 2000) % 1
    } else {
      this._splash.scale.x = 0.5 + (delta / 2000) % 1
      this._splash.scale.y = 0.5 + (delta / 2000) % 1
    }

    const menuSpriteThing = (delta / 25) % 28

    if (menuSpriteThing < 14) {
      this._sprite.height = 16 - menuSpriteThing
      this._sprite.y = this.menuSpriteY + menuSpriteThing / 2
    } else {
      this._sprite.height = 2 + menuSpriteThing - 14
      this._sprite.y = this.menuSpriteY + 14 - menuSpriteThing / 2
    }
  }

}
