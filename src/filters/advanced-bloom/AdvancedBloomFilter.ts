import Phaser from 'phaser';
import fragmentSource from './advanced-bloom.frag?raw';
import {
  addControllerToTarget,
  BaseFilterController,
  FilterMetadata,
  FilterSpace,
  GeneratedFilterNode,
  PhaserFilterTarget,
} from '../runtime';

type Manager = Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager;

export interface AdvancedBloomFilterOptions {
  threshold?: number;
  bloomScale?: number;
  brightness?: number;
  blur?: number;
  quality?: number;
}

export const AdvancedBloomFilterMetadata = {
  id: 'AdvancedBloomFilter',
  displayName: 'Advanced Bloom',
  source: 'pixi-source',
  fishOnly: false,
  defaults: {"threshold":0.5,"bloomScale":1,"brightness":1,"blur":8,"quality":4},
  controls: [{"key":"threshold","type":"number","min":0,"max":1},{"key":"bloomScale","type":"number","min":0,"max":3},{"key":"brightness","type":"number","min":0,"max":3},{"key":"blur","type":"number","min":0,"max":30}]
} satisfies FilterMetadata;

export class PhaserAdvancedBloomFilter extends GeneratedFilterNode {
  constructor(manager: Manager) {
    super('PhaserAdvancedBloomFilter', manager, AdvancedBloomFilterMetadata, fragmentSource);
  }
}

export class AdvancedBloomFilter extends BaseFilterController {
  constructor(camera: Phaser.Cameras.Scene2D.Camera, options: AdvancedBloomFilterOptions = {}) {
    super(camera, 'PhaserAdvancedBloomFilter', AdvancedBloomFilterMetadata, options as Record<string, unknown>);
  }
}

export const addAdvancedBloomFilter = (
  target: PhaserFilterTarget | Phaser.Cameras.Scene2D.Camera,
  options: AdvancedBloomFilterOptions = {},
  space: FilterSpace = 'internal',
): AdvancedBloomFilter => addControllerToTarget(target, AdvancedBloomFilter, options as Record<string, unknown>, space);
