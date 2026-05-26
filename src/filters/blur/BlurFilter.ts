import Phaser from 'phaser';
import fragmentSource from './blur.frag?raw';
import {
  addControllerToTarget,
  BaseFilterController,
  FilterMetadata,
  FilterSpace,
  GeneratedFilterNode,
  PhaserFilterTarget,
} from '../runtime';

type Manager = Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager;

export interface BlurFilterOptions {
  strength?: number;
}

export const BlurFilterMetadata = {
  id: 'BlurFilter',
  displayName: 'Blur',
  source: 'demo-extra',
  fishOnly: false,
  defaults: {"strength":8},
  controls: [{"key":"strength","type":"number","min":0,"max":30}]
} satisfies FilterMetadata;

export class PhaserBlurFilter extends GeneratedFilterNode {
  constructor(manager: Manager) {
    super('PhaserBlurFilter', manager, BlurFilterMetadata, fragmentSource);
  }
}

export class BlurFilter extends BaseFilterController {
  constructor(camera: Phaser.Cameras.Scene2D.Camera, options: BlurFilterOptions = {}) {
    super(camera, 'PhaserBlurFilter', BlurFilterMetadata, options as Record<string, unknown>);
  }
}

export const addBlurFilter = (
  target: PhaserFilterTarget | Phaser.Cameras.Scene2D.Camera,
  options: BlurFilterOptions = {},
  space: FilterSpace = 'internal',
): BlurFilter => addControllerToTarget(target, BlurFilter, options as Record<string, unknown>, space);
