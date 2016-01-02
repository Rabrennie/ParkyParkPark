const _ = require('lodash');

const _keys = {
  37: 0, // left
  39: 0, // right
  38: 0, // up
  40: 0, // down
  13: 0, // enter
  27: 0, // escape
  8 : 0, // backspace
  32: 0, // spacebar
  17: 0, // ctrl
  18: 0, // alt
  91: 0, // Windows Key / Left Command
  93: 0, // Windows Menu / Right Command
  16: 0, // shift
  9 : 0, // tab
  20: 0, // caps lock
  192: 0, // backtick / tilde ("grave accent")
  220: 0, // back slash
};

export const keymap = {
  left      : 37,
  right     : 39,
  up        : 38,
  down      : 40,
  enter     : 13,
  escape    : 27,
  backspace : 8,
  steerLeft : 37,
  steerRight: 39,
  brake     : 40,
  debug     : 192,
}

export function key(name) {
  return _keys[keymap[name]]
}

export function setKey(code, val) {
  _keys[code] = val
}

export function getKeysDown() {
  const downKeys = [];
  _.forOwn(_keys, (value,key) => {
    if(value === 1) {
      downKeys.push(key);
    }
  })
  return downKeys;
}

export function bindKey(name, code) {
  keymap[name] = code;
}

// TODO: Add gamepad support
export function gamepad() {}
