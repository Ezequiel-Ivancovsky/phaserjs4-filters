import Phaser from 'phaser';
import fragmentSource from './color-map.frag?raw';
import {
  addControllerToTarget,
  BaseFilterController,
  FilterMetadata,
  FilterSpace,
  GeneratedFilterNode,
  PhaserFilterTarget,
} from '../runtime';

type Manager = Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager;

export interface ColorMapFilterOptions {
  mix?: number;
  nearest?: boolean;
}

export const ColorMapFilterMetadata = {
  id: 'ColorMapFilter',
  displayName: 'Color Map',
  source: 'pixi-source',
  fishOnly: false,
  defaults: {"mix":1,"nearest":false},
  controls: [{"key":"mix","type":"number","min":0,"max":1},{"key":"nearest","type":"boolean"}]
} satisfies FilterMetadata;

export class PhaserColorMapFilter extends GeneratedFilterNode {
  constructor(manager: Manager) {
    super('PhaserColorMapFilter', manager, ColorMapFilterMetadata, fragmentSource);
  }
}

export class ColorMapFilter extends BaseFilterController {
  constructor(camera: Phaser.Cameras.Scene2D.Camera, options: ColorMapFilterOptions = {}) {
    super(camera, 'PhaserColorMapFilter', ColorMapFilterMetadata, options as Record<string, unknown>);
  }
}

export const addColorMapFilter = (
  target: PhaserFilterTarget | Phaser.Cameras.Scene2D.Camera,
  options: ColorMapFilterOptions = {},
  space: FilterSpace = 'internal',
): ColorMapFilter => addControllerToTarget(target, ColorMapFilter, options as Record<string, unknown>, space);
