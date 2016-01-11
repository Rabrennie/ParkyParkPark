import config from './config'

export function resetContainer() {
  if(config.container.parent) {
    config.stage.removeChild(config.container);
  }

  config.container = new PIXI.Container();

  config.stage.addChild(config.container);

  config.container.position.x =  0;
  config.container.position.y =  0;
  config.container.scale.x =  config.zoom;
  config.container.scale.y = -config.zoom;


}
