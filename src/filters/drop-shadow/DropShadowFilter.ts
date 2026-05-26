import Phaser from 'phaser';
import fragmentSource from './drop-shadow.frag?raw';
import {
  addControllerToTarget,
  BaseFilterController,
  FilterMetadata,
  FilterSpace,
  GeneratedFilterNode,
  PhaserFilterTarget,
} from '../runtime';

type Manager = Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager;

export interface DropShadowFilterOptions {
  offsetX?: number;
  offsetY?: number;
  alpha?: number;
  color?: number | string | number[];
  blur?: number;
  quality?: number;
  shadowOnly?: boolean;
}

export const DropShadowFilterMetadata = {
  id: 'DropShadowFilter',
  displayName: 'Drop Shadow',
  source: 'pixi-source',
  fishOnly: true,
  defaults: {"offsetX":4,"offsetY":4,"alpha":0.5,"color":0,"blur":2,"quality":3,"shadowOnly":false},
  controls: [{"key":"blur","type":"number","min":0,"max":20},{"key":"quality","type":"number","min":0,"max":20},{"key":"alpha","type":"number","min":0,"max":1},{"key":"offsetX","type":"number","min":-50,"max":50},{"key":"offsetY","type":"number","min":-50,"max":50},{"key":"color","type":"color"},{"key":"shadowOnly","type":"boolean"}]
} satisfies FilterMetadata;

export class PhaserDropShadowFilter extends GeneratedFilterNode {
  constructor(manager: Manager) {
    super('PhaserDropShadowFilter', manager, DropShadowFilterMetadata, fragmentSource);
  }
}

export class DropShadowFilter extends BaseFilterController {
  constructor(camera: Phaser.Cameras.Scene2D.Camera, options: DropShadowFilterOptions = {}) {
    super(camera, 'PhaserDropShadowFilter', DropShadowFilterMetadata, options as Record<string, unknown>);
  }
}

export const addDropShadowFilter = (
  target: PhaserFilterTarget | Phaser.Cameras.Scene2D.Camera,
  options: DropShadowFilterOptions = {},
  space: FilterSpace = 'internal',
): DropShadowFilter => addControllerToTarget(target, DropShadowFilter, options as Record<string, unknown>, space);
