import Phaser from 'phaser';
import fragmentSource from './outline.frag?raw';
import {
  addControllerToTarget,
  BaseFilterController,
  FilterMetadata,
  FilterSpace,
  GeneratedFilterNode,
  PhaserFilterTarget,
} from '../runtime';

type Manager = Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager;

export interface OutlineFilterOptions {
  thickness?: number;
  color?: number | string | number[];
  alpha?: number;
}

export const OutlineFilterMetadata = {
  id: 'OutlineFilter',
  displayName: 'Outline',
  source: 'pixi-source',
  fishOnly: true,
  defaults: {"thickness":3,"color":16777215,"alpha":1},
  controls: [{"key":"thickness","type":"number","min":0,"max":20},{"key":"color","type":"color"},{"key":"alpha","type":"number","min":0,"max":1}]
} satisfies FilterMetadata;

export class PhaserOutlineFilter extends GeneratedFilterNode {
  constructor(manager: Manager) {
    super('PhaserOutlineFilter', manager, OutlineFilterMetadata, fragmentSource);
  }
}

export class OutlineFilter extends BaseFilterController {
  constructor(camera: Phaser.Cameras.Scene2D.Camera, options: OutlineFilterOptions = {}) {
    super(camera, 'PhaserOutlineFilter', OutlineFilterMetadata, options as Record<string, unknown>);
  }
}

export const addOutlineFilter = (
  target: PhaserFilterTarget | Phaser.Cameras.Scene2D.Camera,
  options: OutlineFilterOptions = {},
  space: FilterSpace = 'internal',
): OutlineFilter => addControllerToTarget(target, OutlineFilter, options as Record<string, unknown>, space);
