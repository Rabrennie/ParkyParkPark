const W = 940;
const H = W/16*9;
let win = null;

if (!inBrowser) {
  win = electron.remote.getCurrentWindow();
}

export default {
  zoom: 0.05*W,
  W,
  H,
  lastW: W,
  lastH: H,
  SCORE: Math.pow(2,0),
  PLAYER: Math.pow(2,1),
  CAR: Math.pow(2,2),
  WALL: Math.pow(2,3),
  BOMB: Math.pow(2,4),
  EXPLOSION: Math.pow(2,5),
  TRUCKBACK: Math.pow(2,6),
  world: new p2.World({
    gravity : [0,0]
  }),
  renderer: PIXI.autoDetectRenderer(W, H),
  stage: new PIXI.Container(),
  container: new PIXI.Container(),
  // not sure if this is a dirty hack but it works
  scaleFactorX:W/1067,
  scaleFactorY:H/600,
  // user options
  screenShake: 1,
  masterVolume: 1,
  curWin: win,
  fullscreen: false
};
