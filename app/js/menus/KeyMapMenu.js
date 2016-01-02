import config from '../config.js';
import Menu from './Menu.js'
import { key, keymap, bindKey, getKeysDown } from '../Input.js'

const keycode = require('keycode');

export default class KeyMapMenu extends Menu {
  constructor() {
    super({
      optsOffset: 200,
      optsAlign: 'left',
    })

    const renderer = config.renderer

    this._title = new PIXI.Text('Key Bindings',{ font : '24px Arial', fill : 0xFFFFFF, align : 'center' })
    this._title.x = renderer.width/2 - this._title.width/2
    this._title.y = 100
    this.addChild(this._title)

    this.addKeyBind('Steer Left', 'steerLeft')
    this.addKeyBind('Steer Right', 'steerRight')
    this.addKeyBind('Brake', 'brake')

    this.addOption('Back', (menus) => {
      menus.splice(menus.indexOf(this))
      config.stage.removeChild(this)

      return { done: true };
    })
  }

  // TODO: don't allow same key to be bound twice?
  addKeyBind(name, binding) {
    this.addOption(`${name}: ${keycode(keymap[binding])}`, {
      state: {
        active: false
      },
      onInputChange() {
        const downKeys = getKeysDown();
        if (key('enter')) {
          if (!this.state.active) {
            this.state.active = true
            this.textObj.text = `${name}: Press any key`;
          } else {
            this.state.active = false
            const code = parseInt(keymap[binding]);
            const key = keycode(code);
            this.textObj.text = `${name}: ${key}`;
          }
        } else if (downKeys.length > 0 && this.state.active) {
          console.log('3')
          bindKey(binding, downKeys[0])
          const code = parseInt(keymap[binding]);
          const key = keycode(code);
          this.textObj.text = `${name}: ${key}`;
          this.state.active = false;
        }
        return this.state.active
      }
    })
  }
}
