import Phaser from 'phaser';
import fragmentSource from './kawase-blur.frag?raw';
import {
  addControllerToTarget,
  BaseFilterController,
  FilterMetadata,
  FilterSpace,
  GeneratedFilterNode,
  PhaserFilterTarget,
} from '../runtime';

type Manager = Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager;

export interface KawaseBlurFilterOptions {
  strength?: number;
  quality?: number;
  pixelSizeX?: number;
  pixelSizeY?: number;
  clamp?: boolean;
}

export const KawaseBlurFilterMetadata = {
  id: 'KawaseBlurFilter',
  displayName: 'Kawase Blur',
  source: 'pixi-source',
  fishOnly: false,
  defaults: {"strength":4,"quality":3,"pixelSizeX":1,"pixelSizeY":1,"clamp":true},
  controls: [{"key":"strength","type":"number","min":0,"max":20},{"key":"quality","type":"number","min":1,"max":20},{"key":"pixelSizeX","type":"number","min":0,"max":10},{"key":"pixelSizeY","type":"number","min":0,"max":10},{"key":"clamp","type":"boolean"}]
} satisfies FilterMetadata;

export class PhaserKawaseBlurFilter extends GeneratedFilterNode {
  constructor(manager: Manager) {
    super('PhaserKawaseBlurFilter', manager, KawaseBlurFilterMetadata, fragmentSource);
  }
}

export class KawaseBlurFilter extends BaseFilterController {
  constructor(camera: Phaser.Cameras.Scene2D.Camera, options: KawaseBlurFilterOptions = {}) {
    super(camera, 'PhaserKawaseBlurFilter', KawaseBlurFilterMetadata, options as Record<string, unknown>);
  }
}

export const addKawaseBlurFilter = (
  target: PhaserFilterTarget | Phaser.Cameras.Scene2D.Camera,
  options: KawaseBlurFilterOptions = {},
  space: FilterSpace = 'internal',
): KawaseBlurFilter => addControllerToTarget(target, KawaseBlurFilter, options as Record<string, unknown>, space);
