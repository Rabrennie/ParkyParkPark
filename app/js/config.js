export default {
  zoom: 50,
  PLAYER: Math.pow(2, 1),
  CAR: Math.pow(2, 2),
  WALL: Math.pow(2, 3),
  BOMB: Math.pow(2, 4),
  EXPLOSION: Math.pow(2, 5),
  TRUCKBACK: Math.pow(2, 6),
  world: new p2.World({
    gravity: [0, 0]
  }),
  renderer: PIXI.autoDetectRenderer(800, 600),
  stage: new PIXI.Container(),
  container: new PIXI.Container(),

  // user options
  screenShake: 1,
  masterVolume: 1
}
