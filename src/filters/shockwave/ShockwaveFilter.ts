import Phaser from 'phaser';
import fragmentSource from './shockwave.frag?raw';
import {
  addControllerToTarget,
  BaseFilterController,
  FilterMetadata,
  FilterSpace,
  GeneratedFilterNode,
  PhaserFilterTarget,
} from '../runtime';

type Manager = Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager;

export interface ShockwaveFilterOptions {
  animating?: boolean;
  centerX?: number;
  centerY?: number;
  speed?: number;
  amplitude?: number;
  wavelength?: number;
  brightness?: number;
  radius?: number;
  time?: number;
}

export const ShockwaveFilterMetadata = {
  id: 'ShockwaveFilter',
  displayName: 'Shockwave',
  source: 'pixi-source',
  fishOnly: false,
  defaults: {"animating":true,"centerX":0.5,"centerY":0.5,"speed":500,"amplitude":30,"wavelength":160,"brightness":1,"radius":800,"time":0},
  controls: [{"key":"animating","type":"boolean"},{"key":"speed","type":"number","min":500,"max":2000},{"key":"amplitude","type":"number","min":1,"max":100},{"key":"wavelength","type":"number","min":2,"max":400},{"key":"brightness","type":"number","min":0.2,"max":2},{"key":"radius","type":"number","min":100,"max":2000},{"key":"centerX","type":"number","min":0,"max":1},{"key":"centerY","type":"number","min":0,"max":1}]
} satisfies FilterMetadata;

export class PhaserShockwaveFilter extends GeneratedFilterNode {
  constructor(manager: Manager) {
    super('PhaserShockwaveFilter', manager, ShockwaveFilterMetadata, fragmentSource);
  }
}

export class ShockwaveFilter extends BaseFilterController {
  constructor(camera: Phaser.Cameras.Scene2D.Camera, options: ShockwaveFilterOptions = {}) {
    super(camera, 'PhaserShockwaveFilter', ShockwaveFilterMetadata, options as Record<string, unknown>);
  }
}

export const addShockwaveFilter = (
  target: PhaserFilterTarget | Phaser.Cameras.Scene2D.Camera,
  options: ShockwaveFilterOptions = {},
  space: FilterSpace = 'internal',
): ShockwaveFilter => addControllerToTarget(target, ShockwaveFilter, options as Record<string, unknown>, space);
