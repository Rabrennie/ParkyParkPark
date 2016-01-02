import config from '../config.js';
import Menu from './Menu.js'
import { key } from '../Input.js'
import { screenShake } from '../ScreenShake.js'
import { resizeGame } from '../resizeGame.js'
import KeyMapMenu from './KeyMapMenu.js'

export default class OptionsMenu extends Menu {
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

    this.addOption(`Master Volume: ${Math.round(config.masterVolume * 100)}%`, {
      state: {
        accumulator: 0
      },
      update(now, delta) {
        // "this" scope is the actual Option
        this.state.accumulator += delta
        if (this.state.accumulator < 100) return
        this.state.accumulator = 0

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
    this.addOption(`Screen Shake: ${Math.round(config.screenShake * 100)}%`, {
      state: {
        accumulator: 0
      },
      update(now, delta) {
        // "this" scope is the actual Option
        this.state.accumulator += delta
        if (this.state.accumulator < 100) return
        this.state.accumulator = 0

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
    this.addOption(`Resolution ${config.W + 'x' + config.H}`, {
      state: {
        accumulator: 0,
        sizes: [640, 800, 1024],
        curr: 1
      },
      update(now, delta) {
        this.state.accumulator += delta
        if (this.state.accumulator < 50) return
        this.state.accumulator = 0

        this.textObj.text = `Resolution ${config.W + 'x' + config.H}`;
        if (key('left')) {
          if(this.state.curr===0) {
            this.state.curr = this.state.sizes.length-1;
            resizeGame(this.state.sizes[this.state.curr]);
          } else {
            this.state.curr -= 1;
            resizeGame(this.state.sizes[this.state.curr]);
          }
        }
        if (key('right')) {
          if(this.state.curr===this.state.sizes.length-1) {
            this.state.curr = 0;
            resizeGame(this.state.sizes[this.state.curr]);
          } else {
            this.state.curr += 1;
            resizeGame(this.state.sizes[this.state.curr]);
          }
        }
      }
    })

    this.addOption('Key Mapping', (menus) => {
      const newMenu = new KeyMapMenu()
      menus.push(newMenu)
      config.stage.addChild(newMenu)

      return { done: true }
    })


    this.addOption('Back', (menus) => {
      menus.splice(menus.indexOf(this))
      config.stage.removeChild(this)

      return { done: true }
    })
  }
}
