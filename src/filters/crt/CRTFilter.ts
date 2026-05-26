import Phaser from 'phaser';
import fragmentSource from './crt.frag?raw';
import {
  addControllerToTarget,
  BaseFilterController,
  FilterMetadata,
  FilterSpace,
  GeneratedFilterNode,
  PhaserFilterTarget,
} from '../runtime';

type Manager = Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager;

export interface CRTFilterOptions {
  curvature?: number;
  lineWidth?: number;
  noise?: number;
  vignetting?: number;
}

export const CRTFilterMetadata = {
  id: 'CRTFilter',
  displayName: 'Crt',
  source: 'pixi-source',
  fishOnly: false,
  defaults: {"curvature":1,"lineWidth":1,"noise":0.2,"vignetting":0.3},
  controls: [{"key":"curvature","type":"number","min":0,"max":3},{"key":"lineWidth","type":"number","min":0,"max":10},{"key":"noise","type":"number","min":0,"max":1},{"key":"vignetting","type":"number","min":0,"max":1}]
} satisfies FilterMetadata;

export class PhaserCRTFilter extends GeneratedFilterNode {
  constructor(manager: Manager) {
    super('PhaserCRTFilter', manager, CRTFilterMetadata, fragmentSource);
  }
}

export class CRTFilter extends BaseFilterController {
  constructor(camera: Phaser.Cameras.Scene2D.Camera, options: CRTFilterOptions = {}) {
    super(camera, 'PhaserCRTFilter', CRTFilterMetadata, options as Record<string, unknown>);
  }
}

export const addCRTFilter = (
  target: PhaserFilterTarget | Phaser.Cameras.Scene2D.Camera,
  options: CRTFilterOptions = {},
  space: FilterSpace = 'internal',
): CRTFilter => addControllerToTarget(target, CRTFilter, options as Record<string, unknown>, space);
