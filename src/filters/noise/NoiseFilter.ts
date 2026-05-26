import Phaser from 'phaser';
import fragmentSource from './noise.frag?raw';
import {
  addControllerToTarget,
  BaseFilterController,
  FilterMetadata,
  FilterSpace,
  GeneratedFilterNode,
  PhaserFilterTarget,
} from '../runtime';

type Manager = Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager;

export interface NoiseFilterOptions {
  noise?: number;
  seed?: number;
}

export const NoiseFilterMetadata = {
  id: 'NoiseFilter',
  displayName: 'Noise',
  source: 'demo-extra',
  fishOnly: false,
  defaults: {"noise":0.35,"seed":0},
  controls: [{"key":"noise","type":"number","min":0,"max":1},{"key":"seed","type":"number","min":0,"max":100}]
} satisfies FilterMetadata;

export class PhaserNoiseFilter extends GeneratedFilterNode {
  constructor(manager: Manager) {
    super('PhaserNoiseFilter', manager, NoiseFilterMetadata, fragmentSource);
  }
}

export class NoiseFilter extends BaseFilterController {
  constructor(camera: Phaser.Cameras.Scene2D.Camera, options: NoiseFilterOptions = {}) {
    super(camera, 'PhaserNoiseFilter', NoiseFilterMetadata, options as Record<string, unknown>);
  }
}

export const addNoiseFilter = (
  target: PhaserFilterTarget | Phaser.Cameras.Scene2D.Camera,
  options: NoiseFilterOptions = {},
  space: FilterSpace = 'internal',
): NoiseFilter => addControllerToTarget(target, NoiseFilter, options as Record<string, unknown>, space);
