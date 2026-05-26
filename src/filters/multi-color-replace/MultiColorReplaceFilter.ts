import Phaser from 'phaser';
import fragmentSource from './multi-color-replace.frag?raw';
import {
  addControllerToTarget,
  BaseFilterController,
  FilterMetadata,
  FilterSpace,
  GeneratedFilterNode,
  PhaserFilterTarget,
} from '../runtime';

type Manager = Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager;

export interface MultiColorReplaceFilterOptions {
  epsilon?: number;
  originalColor?: number | string | number[];
  targetColor?: number | string | number[];
}

export const MultiColorReplaceFilterMetadata = {
  id: 'MultiColorReplaceFilter',
  displayName: 'Multi Color Replace',
  source: 'pixi-source',
  fishOnly: false,
  defaults: {"epsilon":0.2,"originalColor":16711680,"targetColor":65280},
  controls: [{"key":"epsilon","type":"number","min":0,"max":1},{"key":"originalColor","type":"color"},{"key":"targetColor","type":"color"}]
} satisfies FilterMetadata;

export class PhaserMultiColorReplaceFilter extends GeneratedFilterNode {
  constructor(manager: Manager) {
    super('PhaserMultiColorReplaceFilter', manager, MultiColorReplaceFilterMetadata, fragmentSource);
  }
}

export class MultiColorReplaceFilter extends BaseFilterController {
  constructor(camera: Phaser.Cameras.Scene2D.Camera, options: MultiColorReplaceFilterOptions = {}) {
    super(camera, 'PhaserMultiColorReplaceFilter', MultiColorReplaceFilterMetadata, options as Record<string, unknown>);
  }
}

export const addMultiColorReplaceFilter = (
  target: PhaserFilterTarget | Phaser.Cameras.Scene2D.Camera,
  options: MultiColorReplaceFilterOptions = {},
  space: FilterSpace = 'internal',
): MultiColorReplaceFilter => addControllerToTarget(target, MultiColorReplaceFilter, options as Record<string, unknown>, space);
