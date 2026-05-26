import Phaser from 'phaser';
import fragmentSource from './tilt-shift.frag?raw';
import {
  addControllerToTarget,
  BaseFilterController,
  FilterMetadata,
  FilterSpace,
  GeneratedFilterNode,
  PhaserFilterTarget,
} from '../runtime';

type Manager = Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager;

export interface TiltShiftFilterOptions {
  blur?: number;
  gradientBlur?: number;
  startX?: number;
  startY?: number;
  endX?: number;
  endY?: number;
}

export const TiltShiftFilterMetadata = {
  id: 'TiltShiftFilter',
  displayName: 'Tilt Shift',
  source: 'pixi-source',
  fishOnly: false,
  defaults: {"blur":100,"gradientBlur":600,"startX":0,"startY":0.5,"endX":1,"endY":0.5},
  controls: [{"key":"blur","type":"number","min":0,"max":200},{"key":"gradientBlur","type":"number","min":0,"max":1000},{"key":"startX","type":"number","min":0,"max":1},{"key":"startY","type":"number","min":0,"max":1},{"key":"endX","type":"number","min":0,"max":1},{"key":"endY","type":"number","min":0,"max":1}]
} satisfies FilterMetadata;

export class PhaserTiltShiftFilter extends GeneratedFilterNode {
  constructor(manager: Manager) {
    super('PhaserTiltShiftFilter', manager, TiltShiftFilterMetadata, fragmentSource);
  }
}

export class TiltShiftFilter extends BaseFilterController {
  constructor(camera: Phaser.Cameras.Scene2D.Camera, options: TiltShiftFilterOptions = {}) {
    super(camera, 'PhaserTiltShiftFilter', TiltShiftFilterMetadata, options as Record<string, unknown>);
  }
}

export const addTiltShiftFilter = (
  target: PhaserFilterTarget | Phaser.Cameras.Scene2D.Camera,
  options: TiltShiftFilterOptions = {},
  space: FilterSpace = 'internal',
): TiltShiftFilter => addControllerToTarget(target, TiltShiftFilter, options as Record<string, unknown>, space);
