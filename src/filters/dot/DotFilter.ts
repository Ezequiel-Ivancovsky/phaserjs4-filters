import Phaser from 'phaser';
import fragmentSource from './dot.frag?raw';
import {
  addControllerToTarget,
  BaseFilterController,
  FilterMetadata,
  FilterSpace,
  GeneratedFilterNode,
  PhaserFilterTarget,
} from '../runtime';

type Manager = Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager;

export interface DotFilterOptions {
  scale?: number;
  angle?: number;
}

export const DotFilterMetadata = {
  id: 'DotFilter',
  displayName: 'Dot',
  source: 'pixi-source',
  fishOnly: false,
  defaults: {"scale":1,"angle":5},
  controls: [{"key":"scale","type":"number","min":0.1,"max":4},{"key":"angle","type":"number","min":0,"max":10}]
} satisfies FilterMetadata;

export class PhaserDotFilter extends GeneratedFilterNode {
  constructor(manager: Manager) {
    super('PhaserDotFilter', manager, DotFilterMetadata, fragmentSource);
  }
}

export class DotFilter extends BaseFilterController {
  constructor(camera: Phaser.Cameras.Scene2D.Camera, options: DotFilterOptions = {}) {
    super(camera, 'PhaserDotFilter', DotFilterMetadata, options as Record<string, unknown>);
  }
}

export const addDotFilter = (
  target: PhaserFilterTarget | Phaser.Cameras.Scene2D.Camera,
  options: DotFilterOptions = {},
  space: FilterSpace = 'internal',
): DotFilter => addControllerToTarget(target, DotFilter, options as Record<string, unknown>, space);
