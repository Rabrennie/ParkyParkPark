const config = {}
config.zoom = 50;
config.PLAYER=Math.pow(2,1);
config.CAR=Math.pow(2,2);
config.WALL=Math.pow(2,3);
config.world = new p2.World({
  gravity : [0,0]
});
config.renderer =  PIXI.autoDetectRenderer(800, 600);
config.stage = new PIXI.Stage(0x282B2A);
config.container = new PIXI.Container();

export {config}
