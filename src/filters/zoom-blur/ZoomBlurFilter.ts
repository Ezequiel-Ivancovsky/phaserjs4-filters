import Phaser from 'phaser';
import fragmentSource from './zoom-blur.frag?raw';
import {
  addControllerToTarget,
  BaseFilterController,
  FilterMetadata,
  FilterSpace,
  GeneratedFilterNode,
  PhaserFilterTarget,
} from '../runtime';

type Manager = Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager;

export interface ZoomBlurFilterOptions {
  strength?: number;
  centerX?: number;
  centerY?: number;
  innerRadius?: number;
  radius?: number;
}

export const ZoomBlurFilterMetadata = {
  id: 'ZoomBlurFilter',
  displayName: 'Zoom Blur',
  source: 'pixi-source',
  fishOnly: false,
  defaults: {"strength":0.1,"centerX":0.5,"centerY":0.5,"innerRadius":0,"radius":-1},
  controls: [{"key":"strength","type":"number","min":0,"max":1},{"key":"centerX","type":"number","min":0,"max":1},{"key":"centerY","type":"number","min":0,"max":1},{"key":"innerRadius","type":"number","min":0,"max":300}]
} satisfies FilterMetadata;

export class PhaserZoomBlurFilter extends GeneratedFilterNode {
  constructor(manager: Manager) {
    super('PhaserZoomBlurFilter', manager, ZoomBlurFilterMetadata, fragmentSource);
  }
}

export class ZoomBlurFilter extends BaseFilterController {
  constructor(camera: Phaser.Cameras.Scene2D.Camera, options: ZoomBlurFilterOptions = {}) {
    super(camera, 'PhaserZoomBlurFilter', ZoomBlurFilterMetadata, options as Record<string, unknown>);
  }
}

export const addZoomBlurFilter = (
  target: PhaserFilterTarget | Phaser.Cameras.Scene2D.Camera,
  options: ZoomBlurFilterOptions = {},
  space: FilterSpace = 'internal',
): ZoomBlurFilter => addControllerToTarget(target, ZoomBlurFilter, options as Record<string, unknown>, space);
