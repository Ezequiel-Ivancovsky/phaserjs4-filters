import Phaser from 'phaser';
import fragmentSource from './bloom.frag?raw';
import {
  addControllerToTarget,
  BaseFilterController,
  FilterMetadata,
  FilterSpace,
  GeneratedFilterNode,
  PhaserFilterTarget,
} from '../runtime';

type Manager = Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager;

export interface BloomFilterOptions {
  strength?: number;
  strengthX?: number;
  strengthY?: number;
  quality?: number;
  resolution?: number;
  kernelSize?: number;
}

export const BloomFilterMetadata = {
  id: 'BloomFilter',
  displayName: 'Bloom',
  source: 'pixi-source',
  fishOnly: false,
  defaults: {"strength":2,"strengthX":2,"strengthY":2,"quality":4,"resolution":1,"kernelSize":5},
  controls: [{"key":"strength","type":"number","min":0,"max":20},{"key":"strengthX","type":"number","min":0,"max":20},{"key":"strengthY","type":"number","min":0,"max":20}]
} satisfies FilterMetadata;

export class PhaserBloomFilter extends GeneratedFilterNode {
  constructor(manager: Manager) {
    super('PhaserBloomFilter', manager, BloomFilterMetadata, fragmentSource);
  }
}

export class BloomFilter extends BaseFilterController {
  constructor(camera: Phaser.Cameras.Scene2D.Camera, options: BloomFilterOptions = {}) {
    super(camera, 'PhaserBloomFilter', BloomFilterMetadata, options as Record<string, unknown>);
  }
}

export const addBloomFilter = (
  target: PhaserFilterTarget | Phaser.Cameras.Scene2D.Camera,
  options: BloomFilterOptions = {},
  space: FilterSpace = 'internal',
): BloomFilter => addControllerToTarget(target, BloomFilter, options as Record<string, unknown>, space);
