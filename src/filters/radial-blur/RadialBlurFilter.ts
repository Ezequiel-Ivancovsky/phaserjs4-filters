import Phaser from 'phaser';
import fragmentSource from './radial-blur.frag?raw';
import {
  addControllerToTarget,
  BaseFilterController,
  FilterMetadata,
  FilterSpace,
  GeneratedFilterNode,
  PhaserFilterTarget,
} from '../runtime';

type Manager = Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager;

export interface RadialBlurFilterOptions {
  angle?: number;
  radius?: number;
  centerX?: number;
  centerY?: number;
  kernelSize?: number;
}

export const RadialBlurFilterMetadata = {
  id: 'RadialBlurFilter',
  displayName: 'Radial Blur',
  source: 'pixi-source',
  fishOnly: false,
  defaults: {"angle":20,"radius":-1,"centerX":0.5,"centerY":0.5,"kernelSize":5},
  controls: [{"key":"angle","type":"number","min":-90,"max":90},{"key":"centerX","type":"number","min":0,"max":1},{"key":"centerY","type":"number","min":0,"max":1},{"key":"kernelSize","type":"number","min":1,"max":15}]
} satisfies FilterMetadata;

export class PhaserRadialBlurFilter extends GeneratedFilterNode {
  constructor(manager: Manager) {
    super('PhaserRadialBlurFilter', manager, RadialBlurFilterMetadata, fragmentSource);
  }
}

export class RadialBlurFilter extends BaseFilterController {
  constructor(camera: Phaser.Cameras.Scene2D.Camera, options: RadialBlurFilterOptions = {}) {
    super(camera, 'PhaserRadialBlurFilter', RadialBlurFilterMetadata, options as Record<string, unknown>);
  }
}

export const addRadialBlurFilter = (
  target: PhaserFilterTarget | Phaser.Cameras.Scene2D.Camera,
  options: RadialBlurFilterOptions = {},
  space: FilterSpace = 'internal',
): RadialBlurFilter => addControllerToTarget(target, RadialBlurFilter, options as Record<string, unknown>, space);
