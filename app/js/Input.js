const _ = require('lodash');

const _keys = {
  37: 0, // left
  39: 0, // right
  38: 0, // up
  40: 0, // down
  13: 0, // enter
  27: 0, // escape
  8 : 0, // backspace
};

export const keymap = {
  left      : 37,
  right     : 39,
  up        : 38,
  down      : 40,
  enter     : 13,
  escape    : 27,
  backspace : 8,
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
