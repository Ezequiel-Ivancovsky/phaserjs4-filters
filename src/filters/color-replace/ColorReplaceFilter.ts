import Phaser from 'phaser';
import fragmentSource from './color-replace.frag?raw';
import {
  addControllerToTarget,
  BaseFilterController,
  FilterMetadata,
  FilterSpace,
  GeneratedFilterNode,
  PhaserFilterTarget,
} from '../runtime';

type Manager = Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager;

export interface ColorReplaceFilterOptions {
  originalColor?: number | string | number[];
  newColor?: number | string | number[];
  epsilon?: number;
}

export const ColorReplaceFilterMetadata = {
  id: 'ColorReplaceFilter',
  displayName: 'Color Replace',
  source: 'pixi-source',
  fishOnly: false,
  defaults: {"originalColor":16711680,"newColor":65280,"epsilon":0.4},
  controls: [{"key":"originalColor","type":"color"},{"key":"newColor","type":"color"},{"key":"epsilon","type":"number","min":0,"max":1}]
} satisfies FilterMetadata;

export class PhaserColorReplaceFilter extends GeneratedFilterNode {
  constructor(manager: Manager) {
    super('PhaserColorReplaceFilter', manager, ColorReplaceFilterMetadata, fragmentSource);
  }
}

export class ColorReplaceFilter extends BaseFilterController {
  constructor(camera: Phaser.Cameras.Scene2D.Camera, options: ColorReplaceFilterOptions = {}) {
    super(camera, 'PhaserColorReplaceFilter', ColorReplaceFilterMetadata, options as Record<string, unknown>);
  }
}

export const addColorReplaceFilter = (
  target: PhaserFilterTarget | Phaser.Cameras.Scene2D.Camera,
  options: ColorReplaceFilterOptions = {},
  space: FilterSpace = 'internal',
): ColorReplaceFilter => addControllerToTarget(target, ColorReplaceFilter, options as Record<string, unknown>, space);
