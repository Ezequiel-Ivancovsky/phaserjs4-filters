import Phaser from 'phaser';
import fragmentSource from './hsl-adjustment.frag?raw';
import {
  addControllerToTarget,
  BaseFilterController,
  FilterMetadata,
  FilterSpace,
  GeneratedFilterNode,
  PhaserFilterTarget,
} from '../runtime';

type Manager = Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager;

export interface HslAdjustmentFilterOptions {
  hue?: number;
  saturation?: number;
  lightness?: number;
  colorize?: number | string | number[];
}

export const HslAdjustmentFilterMetadata = {
  id: 'HslAdjustmentFilter',
  displayName: 'Hsl Adjustment',
  source: 'pixi-source',
  fishOnly: false,
  defaults: {"hue":0,"saturation":1,"lightness":0,"colorize":false},
  controls: [{"key":"hue","type":"number","min":-180,"max":180},{"key":"saturation","type":"number","min":0,"max":3},{"key":"lightness","type":"number","min":-1,"max":1},{"key":"colorize","type":"boolean"}]
} satisfies FilterMetadata;

export class PhaserHslAdjustmentFilter extends GeneratedFilterNode {
  constructor(manager: Manager) {
    super('PhaserHslAdjustmentFilter', manager, HslAdjustmentFilterMetadata, fragmentSource);
  }
}

export class HslAdjustmentFilter extends BaseFilterController {
  constructor(camera: Phaser.Cameras.Scene2D.Camera, options: HslAdjustmentFilterOptions = {}) {
    super(camera, 'PhaserHslAdjustmentFilter', HslAdjustmentFilterMetadata, options as Record<string, unknown>);
  }
}

export const addHslAdjustmentFilter = (
  target: PhaserFilterTarget | Phaser.Cameras.Scene2D.Camera,
  options: HslAdjustmentFilterOptions = {},
  space: FilterSpace = 'internal',
): HslAdjustmentFilter => addControllerToTarget(target, HslAdjustmentFilter, options as Record<string, unknown>, space);
