import Phaser from 'phaser';
import fragmentSource from './bulge-pinch.frag?raw';
import {
  addControllerToTarget,
  BaseFilterController,
  FilterMetadata,
  FilterSpace,
  GeneratedFilterNode,
  PhaserFilterTarget,
} from '../runtime';

type Manager = Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager;

export interface BulgePinchFilterOptions {
  radius?: number;
  strength?: number;
  centerX?: number;
  centerY?: number;
}

export const BulgePinchFilterMetadata = {
  id: 'BulgePinchFilter',
  displayName: 'Bulge Pinch',
  source: 'pixi-source',
  fishOnly: false,
  defaults: {"radius":100,"strength":1,"centerX":0.5,"centerY":0.5},
  controls: [{"key":"radius","type":"number","min":1,"max":500},{"key":"strength","type":"number","min":-2,"max":2},{"key":"centerX","type":"number","min":0,"max":1},{"key":"centerY","type":"number","min":0,"max":1}]
} satisfies FilterMetadata;

export class PhaserBulgePinchFilter extends GeneratedFilterNode {
  constructor(manager: Manager) {
    super('PhaserBulgePinchFilter', manager, BulgePinchFilterMetadata, fragmentSource);
  }
}

export class BulgePinchFilter extends BaseFilterController {
  constructor(camera: Phaser.Cameras.Scene2D.Camera, options: BulgePinchFilterOptions = {}) {
    super(camera, 'PhaserBulgePinchFilter', BulgePinchFilterMetadata, options as Record<string, unknown>);
  }
}

export const addBulgePinchFilter = (
  target: PhaserFilterTarget | Phaser.Cameras.Scene2D.Camera,
  options: BulgePinchFilterOptions = {},
  space: FilterSpace = 'internal',
): BulgePinchFilter => addControllerToTarget(target, BulgePinchFilter, options as Record<string, unknown>, space);
