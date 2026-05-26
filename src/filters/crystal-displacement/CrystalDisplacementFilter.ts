import Phaser from 'phaser';
import fragmentSource from './crystal-displacement.frag?raw';
import {
  addControllerToTarget,
  BaseFilterController,
  FilterMetadata,
  FilterSpace,
  GeneratedFilterNode,
  PhaserFilterTarget,
} from '../runtime';

type Manager = Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager;
type DrawingContext = Phaser.Renderer.WebGL.DrawingContext;

export interface CrystalDisplacementFilterOptions {
  displacementMode?: 'facet' | 'vector';
  refractionStrength?: number;
  facetSharpness?: number;
  fresnelStrength?: number;
  magnification?: number;
  glassAlpha?: number;
  highlight?: number;
  chromaticAberration?: number;
  displacementTextureKey?: string;
  captureTextureKey?: string;
}

export const CrystalDisplacementFilterMetadata = {
  id: 'CrystalDisplacementFilter',
  displayName: 'Crystal Displacement',
  source: 'custom',
  crystalOnly: true,
  defaults: {
    displacementMode: 'facet',
    refractionStrength: 1,
    facetSharpness: 1.4,
    fresnelStrength: 0.45,
    magnification: 0.06,
    glassAlpha: 0.42,
    highlight: 0.34,
    chromaticAberration: 2.5,
    displacementTextureKey: 'crystalDisplacementMap',
    captureTextureKey: 'capture',
  },
  controls: [
    { key: 'displacementMode', type: 'select', options: ['facet', 'vector'] },
    { key: 'refractionStrength', type: 'number', min: 0, max: 6, step: 0.01 },
    { key: 'facetSharpness', type: 'number', min: 0.2, max: 4, step: 0.01 },
    { key: 'fresnelStrength', type: 'number', min: 0, max: 2, step: 0.01 },
    { key: 'magnification', type: 'number', min: -0.25, max: 0.5, step: 0.01 },
    { key: 'glassAlpha', type: 'number', min: 0, max: 1, step: 0.01 },
    { key: 'highlight', type: 'number', min: 0, max: 2, step: 0.01 },
    { key: 'chromaticAberration', type: 'number', min: 0, max: 12, step: 0.1 },
  ],
} satisfies FilterMetadata;

export class PhaserCrystalDisplacementFilter extends GeneratedFilterNode {
  constructor(manager: Manager) {
    super('PhaserCrystalDisplacementFilter', manager, CrystalDisplacementFilterMetadata, fragmentSource);
  }

  override setupTextures(controller: CrystalDisplacementFilter, textures: unknown[]): void {
    const textureManager = controller.camera.scene.sys.textures;
    const displacement = textureManager.getFrame(controller.displacementTextureKey);
    const capture = textureManager.getFrame(controller.captureTextureKey);

    textures[1] = displacement?.glTexture ?? textures[0];
    textures[2] = capture?.glTexture ?? textures[0];
  }

  override setupUniforms(controller: CrystalDisplacementFilter, drawingContext: DrawingContext): void {
    controller.updateScreenRect();
    super.setupUniforms(controller, drawingContext);

    const programManager = this.programManager;
    const mode = controller.uniforms.displacementMode === 'vector' ? 1 : 0;

    programManager.setUniform('uCaptureSampler', 2);
    programManager.setUniform('uScreenRect', controller.screenRect);
    programManager.setUniform('uDisplacementMode', mode);
  }
}

export class CrystalDisplacementFilter extends BaseFilterController {
  target?: PhaserFilterTarget;
  screenRect = [0, 0, 1, 1];
  displacementTextureKey: string;
  captureTextureKey: string;

  constructor(camera: Phaser.Cameras.Scene2D.Camera, options: CrystalDisplacementFilterOptions = {}) {
    super(camera, 'PhaserCrystalDisplacementFilter', CrystalDisplacementFilterMetadata, options as Record<string, unknown>);
    this.displacementTextureKey = options.displacementTextureKey ?? 'crystalDisplacementMap';
    this.captureTextureKey = options.captureTextureKey ?? 'capture';
  }

  updateScreenRect(): void {
    if (!this.target || !('getBounds' in this.target)) {
      this.screenRect = [0, 0, this.camera.width, this.camera.height];
      return;
    }

    const bounds = (this.target as unknown as Phaser.GameObjects.Components.GetBounds).getBounds();
    const left = bounds.x - this.camera.scrollX;
    const top = bounds.y - this.camera.scrollY;

    this.screenRect = [left, top, bounds.width, bounds.height];
  }
}

export const addCrystalDisplacementFilter = (
  target: PhaserFilterTarget | Phaser.Cameras.Scene2D.Camera,
  options: CrystalDisplacementFilterOptions = {},
  space: FilterSpace = 'internal',
): CrystalDisplacementFilter => {
  const controller = addControllerToTarget(target, CrystalDisplacementFilter, options as Record<string, unknown>, space);

  if ('enableFilters' in target) {
    controller.target = target;
  }

  return controller;
};
