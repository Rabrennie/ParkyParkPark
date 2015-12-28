import resources from './loader.js'
import config from './config.js'

class Menu extends PIXI.Container {
  constructor() {
    super()
  }

  update(delta) {} // Implement this in subclasses
}

export class MainMenu extends Menu {
  constructor() {
    super()

    const renderer = config.renderer

    this._text = new PIXI.Text('MEGA ALPHA EDITION',{font : '24px Arial', fill : 0xFFFFFF, align : 'center'})
    this._text.x = 20
    this._text.y = 20
    this.addChild(this._text)

    this._play = new PIXI.Text('Play',{font : '24px Arial', fill : 0xFFFFFF, align : 'center'})
    this._play.x = renderer.width/2 - this._play.width/2
    this._play.y = 400
    this.addChild(this._play)

    this._sprite = new PIXI.Sprite(resources.MenuArrow.texture)
    this._sprite.width = 16
    this._sprite.height = 16
    this._sprite.x = this._play.x - 20
    this.menuSpriteY = this._sprite.y = this._play.y + 5
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
