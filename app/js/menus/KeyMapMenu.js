import config from '../config.js';
import Menu from './Menu.js'
import { key, keymap, bindKey, getKeysDown } from '../Input.js'

const keycode = require('keycode');

export default class KeyMapMenu extends Menu {
  constructor() {
    super()
    // TODO: don't allow same key to be bound twice
    const left = keycode(keymap['left']);
    const down = keycode(keymap['down']);
    const right = keycode(keymap['right']);

    this.addOption(`Left: ${left}`, {
      state: {
        active: false
      },
      update() {
        if(this.state.active) {
          this.textObj.text = 'Press any key';
        } else {
          const code = parseInt(keymap['left']);
          const left = keycode(code);
          this.textObj.text = `Left: ${left}`;
        }
        this.textObj.x = config.renderer.width/2 - this.textObj.width/2;
      },
      onInputChange() {
        const downKeys = getKeysDown();
        if(key('enter') && !this.state.active) {
          this.state.active = true;
        } else if(downKeys.length > 0  && !key('enter') && this.state.active) {
          bindKey('left', downKeys[0])
          const code = parseInt(keymap['left']);
          const left = keycode(code);
          this.textObj.text = `Left: ${left}`;
          this.textObj.x = config.renderer.width/2 - this.textObj.width/2;
          this.state.active = false;
        }
        return this.state.active
      }
    })

    this.addOption(`Right: ${right}`, {
      state: {
        active: false
      },
      update() {
        if(this.state.active) {
          this.textObj.text = 'Press any key';
        } else {
          const code = parseInt(keymap['right']);
          const right = keycode(code);
          this.textObj.text = `Right: ${right}`;
        }
        this.textObj.x = config.renderer.width/2 - this.textObj.width/2;
      },
      onInputChange() {
        const downKeys = getKeysDown();
        if(key('enter') && !this.state.active) {
          this.state.active = true;
        } else if(downKeys.length > 0  && !key('enter') && this.state.active) {
          bindKey('right', downKeys[0])
          const code = parseInt(keymap['right']);
          const right = keycode(code);
          this.textObj.text = `Right: ${right}`;
          this.textObj.x = config.renderer.width/2 - this.textObj.width/2;
          this.state.active = false;
        }
        return this.state.active
      }
    })

    this.addOption(`Down: ${down}`, {
      state: {
        active: false
      },
      update() {
        if(this.state.active) {
          this.textObj.text = 'Press any key';
        } else {
          const code = parseInt(keymap['down']);
          const down = keycode(code);
          this.textObj.text = `Down: ${down}`;
        }
        this.textObj.x = config.renderer.width/2 - this.textObj.width/2;
      },
      onInputChange() {
        const downKeys = getKeysDown();
        if(key('enter') && !this.state.active) {
          this.state.active = true;
        } else if(downKeys.length > 0  && !key('enter') && this.state.active) {
          bindKey('down', downKeys[0])
          const code = parseInt(keymap['down']);
          const down = keycode(code);
          this.textObj.text = `Down: ${down}`;
          this.textObj.x = config.renderer.width/2 - this.textObj.width/2;
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
