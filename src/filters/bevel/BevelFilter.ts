import Phaser from 'phaser';
import fragmentSource from './bevel.frag?raw';
import {
  addControllerToTarget,
  BaseFilterController,
  FilterMetadata,
  FilterSpace,
  GeneratedFilterNode,
  PhaserFilterTarget,
} from '../runtime';

type Manager = Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager;

export interface BevelFilterOptions {
  rotation?: number;
  thickness?: number;
  lightColor?: number | string | number[];
  lightAlpha?: number;
  shadowColor?: number | string | number[];
  shadowAlpha?: number;
}

export const BevelFilterMetadata = {
  id: 'BevelFilter',
  displayName: 'Bevel',
  source: 'pixi-source',
  fishOnly: true,
  defaults: {"rotation":45,"thickness":2,"lightColor":16777215,"lightAlpha":0.7,"shadowColor":0,"shadowAlpha":0.7},
  controls: [{"key":"rotation","type":"number","min":0,"max":360},{"key":"thickness","type":"number","min":0,"max":10},{"key":"lightColor","type":"color"},{"key":"lightAlpha","type":"number","min":0,"max":1},{"key":"shadowColor","type":"color"},{"key":"shadowAlpha","type":"number","min":0,"max":1}]
} satisfies FilterMetadata;

export class PhaserBevelFilter extends GeneratedFilterNode {
  constructor(manager: Manager) {
    super('PhaserBevelFilter', manager, BevelFilterMetadata, fragmentSource);
  }
}

export class BevelFilter extends BaseFilterController {
  constructor(camera: Phaser.Cameras.Scene2D.Camera, options: BevelFilterOptions = {}) {
    super(camera, 'PhaserBevelFilter', BevelFilterMetadata, options as Record<string, unknown>);
  }
}

export const addBevelFilter = (
  target: PhaserFilterTarget | Phaser.Cameras.Scene2D.Camera,
  options: BevelFilterOptions = {},
  space: FilterSpace = 'internal',
): BevelFilter => addControllerToTarget(target, BevelFilter, options as Record<string, unknown>, space);
