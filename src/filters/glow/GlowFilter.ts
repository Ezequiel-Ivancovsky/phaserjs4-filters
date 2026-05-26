import Phaser from 'phaser';
import fragmentSource from './glow.frag?raw';
import {
  addControllerToTarget,
  BaseFilterController,
  FilterMetadata,
  FilterSpace,
  GeneratedFilterNode,
  PhaserFilterTarget,
} from '../runtime';

type Manager = Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager;

export interface GlowFilterOptions {
  distance?: number;
  outerStrength?: number;
  innerStrength?: number;
  color?: number | string | number[];
  alpha?: number;
  quality?: number;
  knockout?: boolean;
}

export const GlowFilterMetadata = {
  id: 'GlowFilter',
  displayName: 'Glow',
  source: 'pixi-source',
  fishOnly: true,
  defaults: {"distance":15,"outerStrength":2,"innerStrength":0,"color":16777215,"alpha":1,"quality":0.2,"knockout":false},
  controls: [{"key":"distance","type":"number","min":0,"max":20},{"key":"innerStrength","type":"number","min":0,"max":20},{"key":"outerStrength","type":"number","min":0,"max":20},{"key":"color","type":"color"},{"key":"quality","type":"number","min":0,"max":1},{"key":"alpha","type":"number","min":0,"max":1},{"key":"knockout","type":"boolean"}]
} satisfies FilterMetadata;

export class PhaserGlowFilter extends GeneratedFilterNode {
  constructor(manager: Manager) {
    super('PhaserGlowFilter', manager, GlowFilterMetadata, fragmentSource);
  }
}

export class GlowFilter extends BaseFilterController {
  constructor(camera: Phaser.Cameras.Scene2D.Camera, options: GlowFilterOptions = {}) {
    super(camera, 'PhaserGlowFilter', GlowFilterMetadata, options as Record<string, unknown>);
  }
}

export const addGlowFilter = (
  target: PhaserFilterTarget | Phaser.Cameras.Scene2D.Camera,
  options: GlowFilterOptions = {},
  space: FilterSpace = 'internal',
): GlowFilter => addControllerToTarget(target, GlowFilter, options as Record<string, unknown>, space);
