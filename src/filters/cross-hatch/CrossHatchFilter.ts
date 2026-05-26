import Phaser from 'phaser';
import fragmentSource from './cross-hatch.frag?raw';
import {
  addControllerToTarget,
  BaseFilterController,
  FilterMetadata,
  FilterSpace,
  GeneratedFilterNode,
  PhaserFilterTarget,
} from '../runtime';

type Manager = Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager;

export interface CrossHatchFilterOptions {
  [key: string]: unknown;
}

export const CrossHatchFilterMetadata = {
  id: 'CrossHatchFilter',
  displayName: 'Cross Hatch',
  source: 'pixi-source',
  fishOnly: false,
  defaults: {},
  controls: []
} satisfies FilterMetadata;

export class PhaserCrossHatchFilter extends GeneratedFilterNode {
  constructor(manager: Manager) {
    super('PhaserCrossHatchFilter', manager, CrossHatchFilterMetadata, fragmentSource);
  }
}

export class CrossHatchFilter extends BaseFilterController {
  constructor(camera: Phaser.Cameras.Scene2D.Camera, options: CrossHatchFilterOptions = {}) {
    super(camera, 'PhaserCrossHatchFilter', CrossHatchFilterMetadata, options as Record<string, unknown>);
  }
}

export const addCrossHatchFilter = (
  target: PhaserFilterTarget | Phaser.Cameras.Scene2D.Camera,
  options: CrossHatchFilterOptions = {},
  space: FilterSpace = 'internal',
): CrossHatchFilter => addControllerToTarget(target, CrossHatchFilter, options as Record<string, unknown>, space);
