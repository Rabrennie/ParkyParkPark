const W = 1200;
const H = 900;

export default {
  zoom: 0.0625*W,
  W,
  H,
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
  scaleFactorX:W/800,
  scaleFactorY:H/600,
  // user options
  screenShake: 1,
  masterVolume: 1
};
