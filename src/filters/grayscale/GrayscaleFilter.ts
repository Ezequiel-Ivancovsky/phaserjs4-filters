import Phaser from 'phaser';
import fragmentSource from './grayscale.frag?raw';
import {
  addControllerToTarget,
  BaseFilterController,
  FilterMetadata,
  FilterSpace,
  GeneratedFilterNode,
  PhaserFilterTarget,
} from '../runtime';

type Manager = Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager;

export interface GrayscaleFilterOptions {
  amount?: number;
}

export const GrayscaleFilterMetadata = {
  id: 'GrayscaleFilter',
  displayName: 'Grayscale',
  source: 'pixi-source',
  fishOnly: false,
  defaults: {"amount":1},
  controls: [{"key":"amount","type":"number","min":0,"max":1}]
} satisfies FilterMetadata;

export class PhaserGrayscaleFilter extends GeneratedFilterNode {
  constructor(manager: Manager) {
    super('PhaserGrayscaleFilter', manager, GrayscaleFilterMetadata, fragmentSource);
  }
}

export class GrayscaleFilter extends BaseFilterController {
  constructor(camera: Phaser.Cameras.Scene2D.Camera, options: GrayscaleFilterOptions = {}) {
    super(camera, 'PhaserGrayscaleFilter', GrayscaleFilterMetadata, options as Record<string, unknown>);
  }
}

export const addGrayscaleFilter = (
  target: PhaserFilterTarget | Phaser.Cameras.Scene2D.Camera,
  options: GrayscaleFilterOptions = {},
  space: FilterSpace = 'internal',
): GrayscaleFilter => addControllerToTarget(target, GrayscaleFilter, options as Record<string, unknown>, space);
