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

    // TODO: don't allow same key to be bound twice
    const left = keycode(keymap['steerLeft']);
    const down = keycode(keymap['brake']);
    const right = keycode(keymap['steerRight']);

    this.addOption(`Steer Left: ${left}`, {
      state: {
        active: false
      },
      update() {
        if(this.state.active) {
          this.textObj.text = 'Press any key';
        } else {
          const code = parseInt(keymap['steerLeft']);
          const left = keycode(code);
          this.textObj.text = `Steer Left: ${left}`;
        }
      },
      onInputChange() {
        const downKeys = getKeysDown();
        if(key('enter') && !this.state.active) {
          this.state.active = true;
        } else if(downKeys.length > 0  && !key('enter') && this.state.active) {
          bindKey('steerLeft', downKeys[0])
          const code = parseInt(keymap['steerLeft']);
          const left = keycode(code);
          this.textObj.text = `Steer Left: ${left}`;
          this.state.active = false;
        }
        return this.state.active
      }
    })

    this.addOption(`Steer Right: ${right}`, {
      state: {
        active: false
      },
      update() {
        if(this.state.active) {
          this.textObj.text = 'Press any key';
        } else {
          const code = parseInt(keymap['steerRight']);
          const right = keycode(code);
          this.textObj.text = `Steer Right: ${right}`;
        }
      },
      onInputChange() {
        const downKeys = getKeysDown();
        if(key('enter') && !this.state.active) {
          this.state.active = true;
        } else if(downKeys.length > 0  && !key('enter') && this.state.active) {
          bindKey('steerRight', downKeys[0])
          const code = parseInt(keymap['steerRight']);
          const right = keycode(code);
          this.textObj.text = `Steer Right: ${right}`;
          this.state.active = false;
        }
        return this.state.active
      }
    })

    this.addOption(`Brake: ${down}`, {
      state: {
        active: false
      },
      update() {
        if(this.state.active) {
          this.textObj.text = 'Press any key';
        } else {
          const code = parseInt(keymap['brake']);
          const down = keycode(code);
          this.textObj.text = `Brake: ${down}`;
        }
      },
      onInputChange() {
        const downKeys = getKeysDown();
        if(key('enter') && !this.state.active) {
          this.state.active = true;
        } else if(downKeys.length > 0  && !key('enter') && this.state.active) {
          bindKey('brake', downKeys[0])
          const code = parseInt(keymap['brake']);
          const down = keycode(code);
          this.textObj.text = `Brake: ${down}`;
          this.state.active = false;
        }
        return this.state.active
      }
    })

    this.addOption('Back', (menus) => {
      menus.splice(menus.indexOf(this))
      config.stage.removeChild(this)

      return { done: true };
    })
  }
}
