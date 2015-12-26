
export default {
    zoom: 50,
    PLAYER: Math.pow(2,1),
    CAR: Math.pow(2,2),
    WALL: Math.pow(2,3),
    world: new p2.World({
      gravity : [0,0]
    }),
    renderer: PIXI.autoDetectRenderer(800, 600),
    stage: new PIXI.Stage(0x282B2A),
    container: new PIXI.Container()
};
