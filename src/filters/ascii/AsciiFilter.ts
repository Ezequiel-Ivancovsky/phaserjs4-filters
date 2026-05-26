import Phaser from 'phaser';
import fragmentSource from './ascii.frag?raw';
import {
  addControllerToTarget,
  BaseFilterController,
  FilterMetadata,
  FilterSpace,
  GeneratedFilterNode,
  PhaserFilterTarget,
} from '../runtime';

type Manager = Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager;

export interface AsciiFilterOptions {
  size?: number;
}

export const AsciiFilterMetadata = {
  id: 'AsciiFilter',
  displayName: 'Ascii',
  source: 'pixi-source',
  fishOnly: false,
  defaults: {"size":8},
  controls: [{"key":"size","type":"number","min":2,"max":32}]
} satisfies FilterMetadata;

export class PhaserAsciiFilter extends GeneratedFilterNode {
  constructor(manager: Manager) {
    super('PhaserAsciiFilter', manager, AsciiFilterMetadata, fragmentSource);
  }
}

export class AsciiFilter extends BaseFilterController {
  constructor(camera: Phaser.Cameras.Scene2D.Camera, options: AsciiFilterOptions = {}) {
    super(camera, 'PhaserAsciiFilter', AsciiFilterMetadata, options as Record<string, unknown>);
  }
}

export const addAsciiFilter = (
  target: PhaserFilterTarget | Phaser.Cameras.Scene2D.Camera,
  options: AsciiFilterOptions = {},
  space: FilterSpace = 'internal',
): AsciiFilter => addControllerToTarget(target, AsciiFilter, options as Record<string, unknown>, space);
