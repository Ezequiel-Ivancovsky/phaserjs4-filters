import Phaser from 'phaser';
import fragmentSource from './twist.frag?raw';
import {
  addControllerToTarget,
  BaseFilterController,
  FilterMetadata,
  FilterSpace,
  GeneratedFilterNode,
  PhaserFilterTarget,
} from '../runtime';

type Manager = Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager;

export interface TwistFilterOptions {
  radius?: number;
  angle?: number;
  offsetX?: number;
  offsetY?: number;
}

export const TwistFilterMetadata = {
  id: 'TwistFilter',
  displayName: 'Twist',
  source: 'pixi-source',
  fishOnly: false,
  defaults: {"radius":200,"angle":4,"offsetX":0.5,"offsetY":0.5},
  controls: [{"key":"radius","type":"number","min":1,"max":500},{"key":"angle","type":"number","min":-10,"max":10},{"key":"offsetX","type":"number","min":0,"max":1},{"key":"offsetY","type":"number","min":0,"max":1}]
} satisfies FilterMetadata;

export class PhaserTwistFilter extends GeneratedFilterNode {
  constructor(manager: Manager) {
    super('PhaserTwistFilter', manager, TwistFilterMetadata, fragmentSource);
  }
}

export class TwistFilter extends BaseFilterController {
  constructor(camera: Phaser.Cameras.Scene2D.Camera, options: TwistFilterOptions = {}) {
    super(camera, 'PhaserTwistFilter', TwistFilterMetadata, options as Record<string, unknown>);
  }
}

export const addTwistFilter = (
  target: PhaserFilterTarget | Phaser.Cameras.Scene2D.Camera,
  options: TwistFilterOptions = {},
  space: FilterSpace = 'internal',
): TwistFilter => addControllerToTarget(target, TwistFilter, options as Record<string, unknown>, space);
