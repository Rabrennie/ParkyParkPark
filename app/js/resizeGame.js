import config from './config.js';
export function resizeGame(W, fullscreen) {
  const H = W / 16 * 9;
  config.renderer.resize(W,H);
  config.zoom = 0.05*W;
  config.W = W;
  config.H = H;
  config.scaleFactorX = W/1067;
  config.scaleFactorY = H/600;
  config.container.scale.x =  config.zoom; // zoom in
  config.container.scale.y = -config.zoom;

  if(!inBrowser) {

    if(fullscreen) {
      config.curWin.setFullScreen(true);
    } else {
      config.curWin.setFullScreen(false)
      config.curWin.setContentSize(W,H);
      config.curWin.center();
    }
  }
}
