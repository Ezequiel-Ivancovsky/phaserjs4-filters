import Phaser from 'phaser';
import fragmentSource from './adjustment.frag?raw';
import {
  addControllerToTarget,
  BaseFilterController,
  FilterMetadata,
  FilterSpace,
  GeneratedFilterNode,
  PhaserFilterTarget,
} from '../runtime';

type Manager = Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager;

export interface AdjustmentFilterOptions {
  gamma?: number;
  contrast?: number;
  saturation?: number;
  brightness?: number;
  red?: number;
  green?: number;
  blue?: number;
  alpha?: number;
}

export const AdjustmentFilterMetadata = {
  id: 'AdjustmentFilter',
  displayName: 'Adjustment',
  source: 'pixi-source',
  fishOnly: false,
  defaults: {"gamma":1,"contrast":1,"saturation":1,"brightness":1,"red":1,"green":1,"blue":1,"alpha":1},
  controls: [{"key":"gamma","type":"number","min":0,"max":3},{"key":"contrast","type":"number","min":0,"max":3},{"key":"saturation","type":"number","min":0,"max":3},{"key":"brightness","type":"number","min":0,"max":3},{"key":"red","type":"number","min":0,"max":3},{"key":"green","type":"number","min":0,"max":3},{"key":"blue","type":"number","min":0,"max":3},{"key":"alpha","type":"number","min":0,"max":1}]
} satisfies FilterMetadata;

export class PhaserAdjustmentFilter extends GeneratedFilterNode {
  constructor(manager: Manager) {
    super('PhaserAdjustmentFilter', manager, AdjustmentFilterMetadata, fragmentSource);
  }
}

export class AdjustmentFilter extends BaseFilterController {
  constructor(camera: Phaser.Cameras.Scene2D.Camera, options: AdjustmentFilterOptions = {}) {
    super(camera, 'PhaserAdjustmentFilter', AdjustmentFilterMetadata, options as Record<string, unknown>);
  }
}

export const addAdjustmentFilter = (
  target: PhaserFilterTarget | Phaser.Cameras.Scene2D.Camera,
  options: AdjustmentFilterOptions = {},
  space: FilterSpace = 'internal',
): AdjustmentFilter => addControllerToTarget(target, AdjustmentFilter, options as Record<string, unknown>, space);
