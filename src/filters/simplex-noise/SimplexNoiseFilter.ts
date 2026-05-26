import Phaser from 'phaser';
import fragmentSource from './simplex-noise.frag?raw';
import {
  addControllerToTarget,
  BaseFilterController,
  FilterMetadata,
  FilterSpace,
  GeneratedFilterNode,
  PhaserFilterTarget,
} from '../runtime';

type Manager = Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager;

export interface SimplexNoiseFilterOptions {
  strength?: number;
  step?: number;
}

export const SimplexNoiseFilterMetadata = {
  id: 'SimplexNoiseFilter',
  displayName: 'Simplex Noise',
  source: 'pixi-source',
  fishOnly: false,
  defaults: {"strength":0.25,"step":0.1},
  controls: [{"key":"strength","type":"number","min":0,"max":1},{"key":"step","type":"number","min":0,"max":1}]
} satisfies FilterMetadata;

export class PhaserSimplexNoiseFilter extends GeneratedFilterNode {
  constructor(manager: Manager) {
    super('PhaserSimplexNoiseFilter', manager, SimplexNoiseFilterMetadata, fragmentSource);
  }
}

export class SimplexNoiseFilter extends BaseFilterController {
  constructor(camera: Phaser.Cameras.Scene2D.Camera, options: SimplexNoiseFilterOptions = {}) {
    super(camera, 'PhaserSimplexNoiseFilter', SimplexNoiseFilterMetadata, options as Record<string, unknown>);
  }
}

export const addSimplexNoiseFilter = (
  target: PhaserFilterTarget | Phaser.Cameras.Scene2D.Camera,
  options: SimplexNoiseFilterOptions = {},
  space: FilterSpace = 'internal',
): SimplexNoiseFilter => addControllerToTarget(target, SimplexNoiseFilter, options as Record<string, unknown>, space);
