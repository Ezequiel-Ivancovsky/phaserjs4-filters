import Phaser from 'phaser';
import fragmentSource from './simple-lightmap.frag?raw';
import {
  addControllerToTarget,
  BaseFilterController,
  FilterMetadata,
  FilterSpace,
  GeneratedFilterNode,
  PhaserFilterTarget,
} from '../runtime';

type Manager = Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager;

export interface SimpleLightmapFilterOptions {
  color?: number | string | number[];
  alpha?: number;
}

export const SimpleLightmapFilterMetadata = {
  id: 'SimpleLightmapFilter',
  displayName: 'Simple Lightmap',
  source: 'pixi-source',
  fishOnly: false,
  defaults: {"color":16777215,"alpha":1},
  controls: [{"key":"color","type":"color"},{"key":"alpha","type":"number","min":0,"max":1}]
} satisfies FilterMetadata;

export class PhaserSimpleLightmapFilter extends GeneratedFilterNode {
  constructor(manager: Manager) {
    super('PhaserSimpleLightmapFilter', manager, SimpleLightmapFilterMetadata, fragmentSource);
  }
}

export class SimpleLightmapFilter extends BaseFilterController {
  constructor(camera: Phaser.Cameras.Scene2D.Camera, options: SimpleLightmapFilterOptions = {}) {
    super(camera, 'PhaserSimpleLightmapFilter', SimpleLightmapFilterMetadata, options as Record<string, unknown>);
  }
}

export const addSimpleLightmapFilter = (
  target: PhaserFilterTarget | Phaser.Cameras.Scene2D.Camera,
  options: SimpleLightmapFilterOptions = {},
  space: FilterSpace = 'internal',
): SimpleLightmapFilter => addControllerToTarget(target, SimpleLightmapFilter, options as Record<string, unknown>, space);
