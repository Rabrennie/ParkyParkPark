import config from './config.js';
export function resizeGame(W) {
  const H = W / 4 * 3;
  config.renderer.resize(W,H);
  config.zoom = 0.0625*W;
  config.W = W;
  config.H = H;
  config.scaleFactorX = W/800;
  config.scaleFactorY = H/600;
  config.container.scale.x =  config.zoom; // zoom in
  config.container.scale.y = -config.zoom;
}
