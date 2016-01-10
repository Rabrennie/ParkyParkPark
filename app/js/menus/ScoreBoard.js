import config from '../config.js'
import Menu from './Menu.js'
import gamestate from '../gamestate'
import MainMenu from './MainMenu.js'

export default class ScoreBoard extends Menu {
  constructor() {
    super()
    this._background.alpha = 0.48
    this.removeChild(this._text)

    const renderer = config.renderer

    this._title = new PIXI.Text('Score: ' + gamestate.score ,{ font : '24px Arial', fill : 0xFFFFFF, align : 'center' })
    this._title.x = renderer.width/2 - this._title.width/2
    this._title.y = 100
    this.addChild(this._title)

    this.addOption('Main Menu', (menus) => {

      menus.splice(menus.indexOf(this))
      config.stage.removeChild(this)

      const menu = new MainMenu()
      gamestate.menus.push(menu)
      config.stage.addChild(menu)

      return { done: true }
    })
  }
}
