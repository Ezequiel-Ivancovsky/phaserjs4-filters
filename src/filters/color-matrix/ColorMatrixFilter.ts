import Phaser from 'phaser';
import fragmentSource from './color-matrix.frag?raw';
import {
  addControllerToTarget,
  BaseFilterController,
  FilterMetadata,
  FilterSpace,
  GeneratedFilterNode,
  PhaserFilterTarget,
} from '../runtime';

type Manager = Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager;

export interface ColorMatrixFilterOptions {
  saturation?: number;
  brightness?: number;
  contrast?: number;
}

export const ColorMatrixFilterMetadata = {
  id: 'ColorMatrixFilter',
  displayName: 'Color Matrix',
  source: 'demo-extra',
  fishOnly: false,
  defaults: {"saturation":0.5,"brightness":1,"contrast":1},
  controls: [{"key":"saturation","type":"number","min":0,"max":2},{"key":"brightness","type":"number","min":0,"max":2},{"key":"contrast","type":"number","min":0,"max":2}]
} satisfies FilterMetadata;

export class PhaserColorMatrixFilter extends GeneratedFilterNode {
  constructor(manager: Manager) {
    super('PhaserColorMatrixFilter', manager, ColorMatrixFilterMetadata, fragmentSource);
  }
}

export class ColorMatrixFilter extends BaseFilterController {
  constructor(camera: Phaser.Cameras.Scene2D.Camera, options: ColorMatrixFilterOptions = {}) {
    super(camera, 'PhaserColorMatrixFilter', ColorMatrixFilterMetadata, options as Record<string, unknown>);
  }
}

export const addColorMatrixFilter = (
  target: PhaserFilterTarget | Phaser.Cameras.Scene2D.Camera,
  options: ColorMatrixFilterOptions = {},
  space: FilterSpace = 'internal',
): ColorMatrixFilter => addControllerToTarget(target, ColorMatrixFilter, options as Record<string, unknown>, space);
