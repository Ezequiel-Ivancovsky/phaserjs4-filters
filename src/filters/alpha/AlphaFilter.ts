import Phaser from 'phaser';
import fragmentSource from './alpha.frag?raw';
import {
  addControllerToTarget,
  BaseFilterController,
  FilterMetadata,
  FilterSpace,
  GeneratedFilterNode,
  PhaserFilterTarget,
} from '../runtime';

type Manager = Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager;

export interface AlphaFilterOptions {
  alpha?: number;
}

export const AlphaFilterMetadata = {
  id: 'AlphaFilter',
  displayName: 'Alpha',
  source: 'demo-extra',
  fishOnly: false,
  defaults: {"alpha":0.5},
  controls: [{"key":"alpha","type":"number","min":0,"max":1}]
} satisfies FilterMetadata;

export class PhaserAlphaFilter extends GeneratedFilterNode {
  constructor(manager: Manager) {
    super('PhaserAlphaFilter', manager, AlphaFilterMetadata, fragmentSource);
  }
}

export class AlphaFilter extends BaseFilterController {
  constructor(camera: Phaser.Cameras.Scene2D.Camera, options: AlphaFilterOptions = {}) {
    super(camera, 'PhaserAlphaFilter', AlphaFilterMetadata, options as Record<string, unknown>);
  }
}

export const addAlphaFilter = (
  target: PhaserFilterTarget | Phaser.Cameras.Scene2D.Camera,
  options: AlphaFilterOptions = {},
  space: FilterSpace = 'internal',
): AlphaFilter => addControllerToTarget(target, AlphaFilter, options as Record<string, unknown>, space);
