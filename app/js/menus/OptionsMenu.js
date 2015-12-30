import config from '../config.js';
import Menu from './Menu.js'
import { key } from '../Input.js'
import { screenShake } from '../ScreenShake.js'
import KeyMapMenu from './KeyMapMenu.js'

export default class OptionsMenu extends Menu {
  constructor() {
    super()
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
