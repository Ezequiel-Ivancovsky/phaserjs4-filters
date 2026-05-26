import Phaser from 'phaser';
import fragmentSource from './rgb-split.frag?raw';
import {
  addControllerToTarget,
  BaseFilterController,
  FilterMetadata,
  FilterSpace,
  GeneratedFilterNode,
  PhaserFilterTarget,
} from '../runtime';

type Manager = Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager;

export interface RGBSplitFilterOptions {
  redX?: number;
  redY?: number;
  greenX?: number;
  greenY?: number;
  blueX?: number;
  blueY?: number;
}

export const RGBSplitFilterMetadata = {
  id: 'RGBSplitFilter',
  displayName: 'Rgb Split',
  source: 'pixi-source',
  fishOnly: false,
  defaults: {"redX":-10,"redY":0,"greenX":0,"greenY":0,"blueX":10,"blueY":0},
  controls: [{"key":"redX","type":"number","min":-30,"max":30},{"key":"redY","type":"number","min":-30,"max":30},{"key":"greenX","type":"number","min":-30,"max":30},{"key":"greenY","type":"number","min":-30,"max":30},{"key":"blueX","type":"number","min":-30,"max":30},{"key":"blueY","type":"number","min":-30,"max":30}]
} satisfies FilterMetadata;

export class PhaserRGBSplitFilter extends GeneratedFilterNode {
  constructor(manager: Manager) {
    super('PhaserRGBSplitFilter', manager, RGBSplitFilterMetadata, fragmentSource);
  }
}

export class RGBSplitFilter extends BaseFilterController {
  constructor(camera: Phaser.Cameras.Scene2D.Camera, options: RGBSplitFilterOptions = {}) {
    super(camera, 'PhaserRGBSplitFilter', RGBSplitFilterMetadata, options as Record<string, unknown>);
  }
}

export const addRGBSplitFilter = (
  target: PhaserFilterTarget | Phaser.Cameras.Scene2D.Camera,
  options: RGBSplitFilterOptions = {},
  space: FilterSpace = 'internal',
): RGBSplitFilter => addControllerToTarget(target, RGBSplitFilter, options as Record<string, unknown>, space);
