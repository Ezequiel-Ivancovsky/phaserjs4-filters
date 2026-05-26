import Phaser from 'phaser';
import fragmentSource from './color-overlay.frag?raw';
import {
  addControllerToTarget,
  BaseFilterController,
  FilterMetadata,
  FilterSpace,
  GeneratedFilterNode,
  PhaserFilterTarget,
} from '../runtime';

type Manager = Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager;

export interface ColorOverlayFilterOptions {
  color?: number | string | number[];
  alpha?: number;
}

export const ColorOverlayFilterMetadata = {
  id: 'ColorOverlayFilter',
  displayName: 'Color Overlay',
  source: 'pixi-source',
  fishOnly: true,
  defaults: {"color":16711680,"alpha":1},
  controls: [{"key":"color","type":"color"},{"key":"alpha","type":"number","min":0,"max":1}]
} satisfies FilterMetadata;

export class PhaserColorOverlayFilter extends GeneratedFilterNode {
  constructor(manager: Manager) {
    super('PhaserColorOverlayFilter', manager, ColorOverlayFilterMetadata, fragmentSource);
  }
}

export class ColorOverlayFilter extends BaseFilterController {
  constructor(camera: Phaser.Cameras.Scene2D.Camera, options: ColorOverlayFilterOptions = {}) {
    super(camera, 'PhaserColorOverlayFilter', ColorOverlayFilterMetadata, options as Record<string, unknown>);
  }
}

export const addColorOverlayFilter = (
  target: PhaserFilterTarget | Phaser.Cameras.Scene2D.Camera,
  options: ColorOverlayFilterOptions = {},
  space: FilterSpace = 'internal',
): ColorOverlayFilter => addControllerToTarget(target, ColorOverlayFilter, options as Record<string, unknown>, space);
