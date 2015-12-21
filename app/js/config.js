exports.zoom = 50;
exports.PLAYER=Math.pow(2,1);
exports.CAR=Math.pow(2,2);
exports.WALL=Math.pow(2,3);
exports.world = new p2.World({
  gravity : [0,0]
});
exports.renderer =  PIXI.autoDetectRenderer(800, 600);
exports.stage = new PIXI.Stage(0x282B2A);
exports.container = new PIXI.Container();
