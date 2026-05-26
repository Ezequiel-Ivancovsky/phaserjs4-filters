import Phaser from 'phaser';
import fragmentSource from './displacement.frag?raw';
import {
  addControllerToTarget,
  BaseFilterController,
  FilterMetadata,
  FilterSpace,
  GeneratedFilterNode,
  PhaserFilterTarget,
} from '../runtime';

type Manager = Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager;

export interface DisplacementFilterOptions {
  scaleX?: number;
  scaleY?: number;
  textureKey?: string;
}

export const DisplacementFilterMetadata = {
  id: 'DisplacementFilter',
  displayName: 'Displacement',
  source: 'demo-extra',
  fishOnly: false,
  defaults: {"scaleX":50,"scaleY":50,"textureKey":"map"},
  controls: [{"key":"scaleX","type":"number","min":1,"max":200},{"key":"scaleY","type":"number","min":1,"max":200}]
} satisfies FilterMetadata;

export class PhaserDisplacementFilter extends GeneratedFilterNode {
  constructor(manager: Manager) {
    super('PhaserDisplacementFilter', manager, DisplacementFilterMetadata, fragmentSource);
  }
}

export class DisplacementFilter extends BaseFilterController {
  constructor(camera: Phaser.Cameras.Scene2D.Camera, options: DisplacementFilterOptions = {}) {
    super(camera, 'PhaserDisplacementFilter', DisplacementFilterMetadata, options as Record<string, unknown>);
  }
}

export const addDisplacementFilter = (
  target: PhaserFilterTarget | Phaser.Cameras.Scene2D.Camera,
  options: DisplacementFilterOptions = {},
  space: FilterSpace = 'internal',
): DisplacementFilter => addControllerToTarget(target, DisplacementFilter, options as Record<string, unknown>, space);
