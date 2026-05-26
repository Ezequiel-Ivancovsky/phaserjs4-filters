import Phaser from 'phaser';
import fragmentSource from './motion-blur.frag?raw';
import {
  addControllerToTarget,
  BaseFilterController,
  FilterMetadata,
  FilterSpace,
  GeneratedFilterNode,
  PhaserFilterTarget,
} from '../runtime';

type Manager = Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager;

export interface MotionBlurFilterOptions {
  velocityX?: number;
  velocityY?: number;
  kernelSize?: number;
  offset?: number;
}

export const MotionBlurFilterMetadata = {
  id: 'MotionBlurFilter',
  displayName: 'Motion Blur',
  source: 'pixi-source',
  fishOnly: false,
  defaults: {"velocityX":12,"velocityY":0,"kernelSize":5,"offset":0},
  controls: [{"key":"velocityX","type":"number","min":-50,"max":50},{"key":"velocityY","type":"number","min":-50,"max":50},{"key":"kernelSize","type":"number","min":1,"max":15},{"key":"offset","type":"number","min":-1,"max":1}]
} satisfies FilterMetadata;

export class PhaserMotionBlurFilter extends GeneratedFilterNode {
  constructor(manager: Manager) {
    super('PhaserMotionBlurFilter', manager, MotionBlurFilterMetadata, fragmentSource);
  }
}

export class MotionBlurFilter extends BaseFilterController {
  constructor(camera: Phaser.Cameras.Scene2D.Camera, options: MotionBlurFilterOptions = {}) {
    super(camera, 'PhaserMotionBlurFilter', MotionBlurFilterMetadata, options as Record<string, unknown>);
  }
}

export const addMotionBlurFilter = (
  target: PhaserFilterTarget | Phaser.Cameras.Scene2D.Camera,
  options: MotionBlurFilterOptions = {},
  space: FilterSpace = 'internal',
): MotionBlurFilter => addControllerToTarget(target, MotionBlurFilter, options as Record<string, unknown>, space);
