import Phaser from 'phaser';
import fragmentSource from './glitch.frag?raw';
import {
  addControllerToTarget,
  BaseFilterController,
  FilterMetadata,
  FilterSpace,
  GeneratedFilterNode,
  PhaserFilterTarget,
} from '../runtime';

type Manager = Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager;

export interface GlitchFilterOptions {
  slices?: number;
  offset?: number;
  direction?: number;
  fillMode?: number;
  seed?: number;
}

export const GlitchFilterMetadata = {
  id: 'GlitchFilter',
  displayName: 'Glitch',
  source: 'pixi-source',
  fishOnly: false,
  defaults: {"slices":5,"offset":10,"direction":0,"fillMode":0,"seed":0},
  controls: [{"key":"slices","type":"number","min":1,"max":20},{"key":"offset","type":"number","min":0,"max":50},{"key":"direction","type":"number","min":0,"max":360},{"key":"seed","type":"number","min":0,"max":20}]
} satisfies FilterMetadata;

export class PhaserGlitchFilter extends GeneratedFilterNode {
  constructor(manager: Manager) {
    super('PhaserGlitchFilter', manager, GlitchFilterMetadata, fragmentSource);
  }
}

export class GlitchFilter extends BaseFilterController {
  constructor(camera: Phaser.Cameras.Scene2D.Camera, options: GlitchFilterOptions = {}) {
    super(camera, 'PhaserGlitchFilter', GlitchFilterMetadata, options as Record<string, unknown>);
  }
}

export const addGlitchFilter = (
  target: PhaserFilterTarget | Phaser.Cameras.Scene2D.Camera,
  options: GlitchFilterOptions = {},
  space: FilterSpace = 'internal',
): GlitchFilter => addControllerToTarget(target, GlitchFilter, options as Record<string, unknown>, space);
