import Phaser from 'phaser';
import fragmentSource from './backdrop-blur.frag?raw';
import {
  addControllerToTarget,
  BaseFilterController,
  FilterMetadata,
  FilterSpace,
  GeneratedFilterNode,
  PhaserFilterTarget,
} from '../runtime';

type Manager = Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager;

export interface BackdropBlurFilterOptions {
  strength?: number;
}

export const BackdropBlurFilterMetadata = {
  id: 'BackdropBlurFilter',
  displayName: 'Backdrop Blur',
  source: 'pixi-source',
  fishOnly: false,
  defaults: {"strength":8},
  controls: [{"key":"strength","type":"number","min":0,"max":30}]
} satisfies FilterMetadata;

export class PhaserBackdropBlurFilter extends GeneratedFilterNode {
  constructor(manager: Manager) {
    super('PhaserBackdropBlurFilter', manager, BackdropBlurFilterMetadata, fragmentSource);
  }
}

export class BackdropBlurFilter extends BaseFilterController {
  constructor(camera: Phaser.Cameras.Scene2D.Camera, options: BackdropBlurFilterOptions = {}) {
    super(camera, 'PhaserBackdropBlurFilter', BackdropBlurFilterMetadata, options as Record<string, unknown>);
  }
}

export const addBackdropBlurFilter = (
  target: PhaserFilterTarget | Phaser.Cameras.Scene2D.Camera,
  options: BackdropBlurFilterOptions = {},
  space: FilterSpace = 'internal',
): BackdropBlurFilter => addControllerToTarget(target, BackdropBlurFilter, options as Record<string, unknown>, space);
