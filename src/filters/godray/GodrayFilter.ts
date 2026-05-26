import Phaser from 'phaser';
import fragmentSource from './godray.frag?raw';
import {
  addControllerToTarget,
  BaseFilterController,
  FilterMetadata,
  FilterSpace,
  GeneratedFilterNode,
  PhaserFilterTarget,
} from '../runtime';

type Manager = Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager;

export interface GodrayFilterOptions {
  gain?: number;
  lacunarity?: number;
  parallel?: boolean;
  time?: number;
  angle?: number;
}

export const GodrayFilterMetadata = {
  id: 'GodrayFilter',
  displayName: 'Godray',
  source: 'pixi-source',
  fishOnly: false,
  defaults: {"gain":0.5,"lacunarity":2.5,"parallel":true,"time":0,"angle":30},
  controls: [{"key":"gain","type":"number","min":0,"max":2},{"key":"lacunarity","type":"number","min":0,"max":5},{"key":"parallel","type":"boolean"},{"key":"angle","type":"number","min":0,"max":360}]
} satisfies FilterMetadata;

export class PhaserGodrayFilter extends GeneratedFilterNode {
  constructor(manager: Manager) {
    super('PhaserGodrayFilter', manager, GodrayFilterMetadata, fragmentSource);
  }
}

export class GodrayFilter extends BaseFilterController {
  constructor(camera: Phaser.Cameras.Scene2D.Camera, options: GodrayFilterOptions = {}) {
    super(camera, 'PhaserGodrayFilter', GodrayFilterMetadata, options as Record<string, unknown>);
  }
}

export const addGodrayFilter = (
  target: PhaserFilterTarget | Phaser.Cameras.Scene2D.Camera,
  options: GodrayFilterOptions = {},
  space: FilterSpace = 'internal',
): GodrayFilter => addControllerToTarget(target, GodrayFilter, options as Record<string, unknown>, space);
