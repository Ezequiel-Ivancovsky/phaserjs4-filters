import Phaser from 'phaser';
import fragmentSource from './convolution.frag?raw';
import {
  addControllerToTarget,
  BaseFilterController,
  FilterMetadata,
  FilterSpace,
  GeneratedFilterNode,
  PhaserFilterTarget,
} from '../runtime';

type Manager = Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager;

export interface ConvolutionFilterOptions {
  strength?: number;
}

export const ConvolutionFilterMetadata = {
  id: 'ConvolutionFilter',
  displayName: 'Convolution',
  source: 'pixi-source',
  fishOnly: false,
  defaults: {"strength":1},
  controls: [{"key":"strength","type":"number","min":-3,"max":3}]
} satisfies FilterMetadata;

export class PhaserConvolutionFilter extends GeneratedFilterNode {
  constructor(manager: Manager) {
    super('PhaserConvolutionFilter', manager, ConvolutionFilterMetadata, fragmentSource);
  }
}

export class ConvolutionFilter extends BaseFilterController {
  constructor(camera: Phaser.Cameras.Scene2D.Camera, options: ConvolutionFilterOptions = {}) {
    super(camera, 'PhaserConvolutionFilter', ConvolutionFilterMetadata, options as Record<string, unknown>);
  }
}

export const addConvolutionFilter = (
  target: PhaserFilterTarget | Phaser.Cameras.Scene2D.Camera,
  options: ConvolutionFilterOptions = {},
  space: FilterSpace = 'internal',
): ConvolutionFilter => addControllerToTarget(target, ConvolutionFilter, options as Record<string, unknown>, space);
