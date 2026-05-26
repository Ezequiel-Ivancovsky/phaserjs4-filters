import Phaser from 'phaser';
import fragmentSource from './old-film.frag?raw';
import {
  addControllerToTarget,
  BaseFilterController,
  FilterMetadata,
  FilterSpace,
  GeneratedFilterNode,
  PhaserFilterTarget,
} from '../runtime';

type Manager = Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager;

export interface OldFilmFilterOptions {
  sepia?: number;
  noise?: number;
  noiseSize?: number;
  scratch?: number;
  scratchDensity?: number;
  scratchWidth?: number;
  vignetting?: number;
  vignettingAlpha?: number;
  vignettingBlur?: number;
  seed?: number;
}

export const OldFilmFilterMetadata = {
  id: 'OldFilmFilter',
  displayName: 'Old Film',
  source: 'pixi-source',
  fishOnly: false,
  defaults: {"sepia":0.3,"noise":0.3,"noiseSize":1,"scratch":0.5,"scratchDensity":0.3,"scratchWidth":1,"vignetting":0.3,"vignettingAlpha":1,"vignettingBlur":0.3,"seed":0},
  controls: [{"key":"sepia","type":"number","min":0,"max":1},{"key":"noise","type":"number","min":0,"max":1},{"key":"noiseSize","type":"number","min":1,"max":10},{"key":"scratch","type":"number","min":-1,"max":1},{"key":"scratchDensity","type":"number","min":0,"max":1},{"key":"scratchWidth","type":"number","min":1,"max":20},{"key":"vignetting","type":"number","min":0,"max":1},{"key":"vignettingAlpha","type":"number","min":0,"max":1},{"key":"vignettingBlur","type":"number","min":0,"max":1}]
} satisfies FilterMetadata;

export class PhaserOldFilmFilter extends GeneratedFilterNode {
  constructor(manager: Manager) {
    super('PhaserOldFilmFilter', manager, OldFilmFilterMetadata, fragmentSource);
  }
}

export class OldFilmFilter extends BaseFilterController {
  constructor(camera: Phaser.Cameras.Scene2D.Camera, options: OldFilmFilterOptions = {}) {
    super(camera, 'PhaserOldFilmFilter', OldFilmFilterMetadata, options as Record<string, unknown>);
  }
}

export const addOldFilmFilter = (
  target: PhaserFilterTarget | Phaser.Cameras.Scene2D.Camera,
  options: OldFilmFilterOptions = {},
  space: FilterSpace = 'internal',
): OldFilmFilter => addControllerToTarget(target, OldFilmFilter, options as Record<string, unknown>, space);
