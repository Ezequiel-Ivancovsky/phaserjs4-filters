import Phaser from 'phaser';
import fragmentSource from './color-gradient.frag?raw';
import {
  addControllerToTarget,
  BaseFilterController,
  FilterMetadata,
  FilterSpace,
  GeneratedFilterNode,
  PhaserFilterTarget,
} from '../runtime';

type Manager = Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager;

export interface ColorGradientFilterOptions {
  type?: number;
  alpha?: number;
  angle?: number;
  maxColors?: number;
  replace?: boolean;
  stops?: Array<{ offset: number; color: number | string | number[]; alpha: number }>;
}

export const ColorGradientFilterMetadata = {
  id: 'ColorGradientFilter',
  displayName: 'Color Gradient',
  source: 'pixi-source',
  fishOnly: true,
  defaults: {"type":0,"alpha":1,"angle":90,"maxColors":0,"replace":false,"stops":[{"offset":0,"color":16711680,"alpha":1},{"offset":1,"color":255,"alpha":1}]},
  controls: []
} satisfies FilterMetadata;

export class PhaserColorGradientFilter extends GeneratedFilterNode {
  constructor(manager: Manager) {
    super('PhaserColorGradientFilter', manager, ColorGradientFilterMetadata, fragmentSource);
  }
}

export class ColorGradientFilter extends BaseFilterController {
  constructor(camera: Phaser.Cameras.Scene2D.Camera, options: ColorGradientFilterOptions = {}) {
    super(camera, 'PhaserColorGradientFilter', ColorGradientFilterMetadata, options as Record<string, unknown>);
  }
}

export const addColorGradientFilter = (
  target: PhaserFilterTarget | Phaser.Cameras.Scene2D.Camera,
  options: ColorGradientFilterOptions = {},
  space: FilterSpace = 'internal',
): ColorGradientFilter => addControllerToTarget(target, ColorGradientFilter, options as Record<string, unknown>, space);
