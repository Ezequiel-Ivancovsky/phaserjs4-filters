import Phaser from 'phaser';
import fragmentSource from './pixelate.frag?raw';
import {
  addControllerToTarget,
  BaseFilterController,
  FilterMetadata,
  FilterSpace,
  GeneratedFilterNode,
  PhaserFilterTarget,
} from '../runtime';

type Manager = Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager;

export interface PixelateFilterOptions {
  sizeX?: number;
  sizeY?: number;
}

export const PixelateFilterMetadata = {
  id: 'PixelateFilter',
  displayName: 'Pixelate',
  source: 'pixi-source',
  fishOnly: false,
  defaults: {"sizeX":10,"sizeY":10},
  controls: [{"key":"sizeX","type":"number","min":1,"max":80},{"key":"sizeY","type":"number","min":1,"max":80}]
} satisfies FilterMetadata;

export class PhaserPixelateFilter extends GeneratedFilterNode {
  constructor(manager: Manager) {
    super('PhaserPixelateFilter', manager, PixelateFilterMetadata, fragmentSource);
  }
}

export class PixelateFilter extends BaseFilterController {
  constructor(camera: Phaser.Cameras.Scene2D.Camera, options: PixelateFilterOptions = {}) {
    super(camera, 'PhaserPixelateFilter', PixelateFilterMetadata, options as Record<string, unknown>);
  }
}

export const addPixelateFilter = (
  target: PhaserFilterTarget | Phaser.Cameras.Scene2D.Camera,
  options: PixelateFilterOptions = {},
  space: FilterSpace = 'internal',
): PixelateFilter => addControllerToTarget(target, PixelateFilter, options as Record<string, unknown>, space);
