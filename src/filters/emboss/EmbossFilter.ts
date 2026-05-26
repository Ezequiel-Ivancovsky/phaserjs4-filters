import Phaser from 'phaser';
import fragmentSource from './emboss.frag?raw';
import {
  addControllerToTarget,
  BaseFilterController,
  FilterMetadata,
  FilterSpace,
  GeneratedFilterNode,
  PhaserFilterTarget,
} from '../runtime';

type Manager = Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager;

export interface EmbossFilterOptions {
  strength?: number;
}

export const EmbossFilterMetadata = {
  id: 'EmbossFilter',
  displayName: 'Emboss',
  source: 'pixi-source',
  fishOnly: false,
  defaults: {"strength":5},
  controls: [{"key":"strength","type":"number","min":0,"max":20}]
} satisfies FilterMetadata;

export class PhaserEmbossFilter extends GeneratedFilterNode {
  constructor(manager: Manager) {
    super('PhaserEmbossFilter', manager, EmbossFilterMetadata, fragmentSource);
  }
}

export class EmbossFilter extends BaseFilterController {
  constructor(camera: Phaser.Cameras.Scene2D.Camera, options: EmbossFilterOptions = {}) {
    super(camera, 'PhaserEmbossFilter', EmbossFilterMetadata, options as Record<string, unknown>);
  }
}

export const addEmbossFilter = (
  target: PhaserFilterTarget | Phaser.Cameras.Scene2D.Camera,
  options: EmbossFilterOptions = {},
  space: FilterSpace = 'internal',
): EmbossFilter => addControllerToTarget(target, EmbossFilter, options as Record<string, unknown>, space);
