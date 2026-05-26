import Phaser from 'phaser';
import fragmentSource from './reflection.frag?raw';
import {
  addControllerToTarget,
  BaseFilterController,
  FilterMetadata,
  FilterSpace,
  GeneratedFilterNode,
  PhaserFilterTarget,
} from '../runtime';

type Manager = Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager;

export interface ReflectionFilterOptions {
  animating?: boolean;
  mirror?: boolean;
  boundary?: number;
  amplitudeStart?: number;
  amplitudeEnd?: number;
  waveLengthStart?: number;
  waveLengthEnd?: number;
  alphaStart?: number;
  alphaEnd?: number;
  time?: number;
}

export const ReflectionFilterMetadata = {
  id: 'ReflectionFilter',
  displayName: 'Reflection',
  source: 'pixi-source',
  fishOnly: false,
  defaults: {"animating":true,"mirror":true,"boundary":0.5,"amplitudeStart":0,"amplitudeEnd":20,"waveLengthStart":30,"waveLengthEnd":100,"alphaStart":1,"alphaEnd":1,"time":0},
  controls: [{"key":"animating","type":"boolean"},{"key":"mirror","type":"boolean"},{"key":"boundary","type":"number","min":0,"max":1},{"key":"amplitudeStart","type":"number","min":0,"max":50},{"key":"amplitudeEnd","type":"number","min":0,"max":50},{"key":"waveLengthStart","type":"number","min":10,"max":200},{"key":"waveLengthEnd","type":"number","min":10,"max":200},{"key":"alphaStart","type":"number","min":0,"max":1},{"key":"alphaEnd","type":"number","min":0,"max":1},{"key":"time","type":"number","min":0,"max":20}]
} satisfies FilterMetadata;

export class PhaserReflectionFilter extends GeneratedFilterNode {
  constructor(manager: Manager) {
    super('PhaserReflectionFilter', manager, ReflectionFilterMetadata, fragmentSource);
  }
}

export class ReflectionFilter extends BaseFilterController {
  constructor(camera: Phaser.Cameras.Scene2D.Camera, options: ReflectionFilterOptions = {}) {
    super(camera, 'PhaserReflectionFilter', ReflectionFilterMetadata, options as Record<string, unknown>);
  }
}

export const addReflectionFilter = (
  target: PhaserFilterTarget | Phaser.Cameras.Scene2D.Camera,
  options: ReflectionFilterOptions = {},
  space: FilterSpace = 'internal',
): ReflectionFilter => addControllerToTarget(target, ReflectionFilter, options as Record<string, unknown>, space);
