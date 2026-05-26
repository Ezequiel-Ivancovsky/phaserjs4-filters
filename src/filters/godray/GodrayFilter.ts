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
  animating?: boolean;
  time?: number;
  gain?: number;
  lacunarity?: number;
  alpha?: number;
  parallel?: boolean;
  angle?: number;
  centerX?: number;
  centerY?: number;
}

export const GodrayFilterMetadata = {
  id: 'GodrayFilter',
  displayName: 'Godray',
  source: 'pixi-source',
  fishOnly: false,
  defaults: {"animating":true,"time":0,"gain":0.6,"lacunarity":2.75,"alpha":1,"parallel":true,"angle":30,"centerX":0.5,"centerY":-0.15},
  controls: [{"key":"animating","type":"boolean"},{"key":"time","type":"number","min":0,"max":1},{"key":"gain","type":"number","min":0,"max":1},{"key":"lacunarity","type":"number","min":0,"max":5},{"key":"alpha","type":"number","min":0,"max":1},{"key":"parallel","type":"boolean"},{"key":"angle","type":"number","min":-60,"max":60},{"key":"centerX","type":"number","min":-0.25,"max":1.25},{"key":"centerY","type":"number","min":-1.5,"max":0}]
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
