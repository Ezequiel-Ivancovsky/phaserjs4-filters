import Phaser from 'phaser';
import { hexToRgb, normalizeColor } from './color';

export type FilterSpace = 'internal' | 'external';

export type FilterUniformValue =
  | number
  | boolean
  | string
  | number[]
  | Float32Array
  | Array<Record<string, unknown>>
  | undefined;

export type PhaserFilterTarget = Phaser.GameObjects.GameObject & {
  enableFilters?: () => PhaserFilterTarget;
  filters?: {
    internal?: { add: (controller: unknown) => unknown };
    external?: { add: (controller: unknown) => unknown };
  } | null;
  filterCamera?: Phaser.Cameras.Scene2D.Camera;
  scene?: Phaser.Scene;
};

export interface FilterMetadata {
  id: string;
  displayName: string;
  source: 'pixi-source' | 'demo-extra';
  fishOnly?: boolean;
  defaults: Record<string, FilterUniformValue>;
  controls: FilterControl[];
}

export interface FilterControl {
  key: string;
  type: 'number' | 'boolean' | 'color' | 'select';
  min?: number;
  max?: number;
  step?: number;
  options?: string[];
}

export type FilterControllerConstructor<T extends BaseFilterController = BaseFilterController> = new (
  camera: Phaser.Cameras.Scene2D.Camera,
  options?: Record<string, unknown>,
) => T;

export { hexToRgb, normalizeColor };

type Manager = Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager;
type DrawingContext = Phaser.Renderer.WebGL.DrawingContext;

const setUniformValue = (programManager: Phaser.Renderer.WebGL.ProgramManager, name: string, value: unknown): void => {
  programManager.setUniform(name, value);
};

export class BaseFilterController extends Phaser.Filters.Controller {
  readonly metadata: FilterMetadata;
  readonly uniforms: Record<string, FilterUniformValue>;
  enabled = false;

  constructor(
    camera: Phaser.Cameras.Scene2D.Camera,
    renderNodeName: string,
    metadata: FilterMetadata,
    options: Record<string, unknown> = {},
  ) {
    super(camera, renderNodeName);
    this.metadata = metadata;
    this.uniforms = { ...metadata.defaults, ...options } as Record<string, FilterUniformValue>;
    Object.assign(this, this.uniforms);
    this.updatePadding();
  }

  syncUniforms(): void {
    for (const key of Object.keys(this.metadata.defaults)) {
      this.uniforms[key] = (this as unknown as Record<string, FilterUniformValue>)[key];
    }
    this.updatePadding();
  }

  private updatePadding(): void {
    if (this.metadata.id === 'BevelFilter') {
      const thickness = Number(this.uniforms.thickness ?? 2);
      const padding = Math.max(1, Math.ceil(thickness));
      this.setPaddingOverride(-padding, -padding, padding, padding);
    } else if (this.metadata.id === 'GlowFilter' || this.metadata.id === 'OutlineFilter') {
      this.setPaddingOverride(null);
    } else if (this.metadata.id === 'DropShadowFilter') {
      this.setPaddingOverride(0, 0, 0, 0);
    }
  }

  override getPadding(): Phaser.Geom.Rectangle {
    if (this.metadata.id === 'GlowFilter' || this.metadata.id === 'OutlineFilter') {
      const paddingUniform = this.metadata.id === 'GlowFilter' ? 'distance' : 'thickness';
      const defaultPadding = this.metadata.id === 'GlowFilter' ? 15 : 3;
      const distance = Math.max(0, Math.ceil(Number(this.uniforms[paddingUniform] ?? defaultPadding)));

      this.currentPadding.setTo(-distance, -distance, distance * 2, distance * 2);

      return this.currentPadding;
    }

    return super.getPadding();
  }
}

export class GeneratedFilterNode extends Phaser.Renderer.WebGL.RenderNodes.BaseFilterShader {
  readonly metadata: FilterMetadata;

  constructor(name: string, manager: Manager, metadata: FilterMetadata, fragmentSource: string) {
    super(name, manager, undefined, fragmentSource);
    this.metadata = metadata;
  }

  setupUniforms(controller: BaseFilterController, drawingContext: DrawingContext): void {
    controller.syncUniforms();
    const programManager = this.programManager;
    setUniformValue(programManager, 'uMainSampler', 0);
    setUniformValue(programManager, 'uResolution', [drawingContext.width || 1, drawingContext.height || 1]);
    setUniformValue(programManager, 'uTime', controller.uniforms.time ?? performance.now() / 16.6667);
    setUniformValue(programManager, 'uDisplacementSampler', 1);

    if (controller.metadata.id === 'ColorGradientFilter') {
      const rawStops = Array.isArray(controller.uniforms.stops) ? controller.uniforms.stops : [];
      const stops = rawStops
        .map((stop) => stop as { offset?: number; color?: unknown; alpha?: number })
        .sort((a, b) => (a.offset ?? 0) - (b.offset ?? 0))
        .slice(0, 16);
      const stopCount = Math.max(2, stops.length);

      for (let index = 0; index < 16; index += 1) {
        const stop = stops[index] ?? stops[stops.length - 1] ?? { offset: index, color: 0xffffff, alpha: 1 };
        const [r, g, b] = hexToRgb(stop.color ?? 0xffffff);
        setUniformValue(programManager, `uStop${index}R`, r);
        setUniformValue(programManager, `uStop${index}G`, g);
        setUniformValue(programManager, `uStop${index}B`, b);
        setUniformValue(programManager, `uStop${index}Offset`, typeof stop.offset === 'number' ? stop.offset : index);
        setUniformValue(programManager, `uStop${index}Alpha`, typeof stop.alpha === 'number' ? stop.alpha : 1);
      }

      setUniformValue(programManager, 'uStopCount', stopCount);
    }

    for (const [key, value] of Object.entries(controller.uniforms)) {
      if (key === 'time' || key === 'resolution' || key === 'stops' || key === 'textureKey') {
        continue;
      }

      if (key !== 'maxColors' && key.toLowerCase().includes('color')) {
        const [r, g, b] = hexToRgb(value);
        const base = key[0].toUpperCase() + key.slice(1);
        setUniformValue(programManager, `u${base}R`, r);
        setUniformValue(programManager, `u${base}G`, g);
        setUniformValue(programManager, `u${base}B`, b);
      } else if (typeof value === 'boolean') {
        setUniformValue(programManager, `u${key[0].toUpperCase()}${key.slice(1)}`, value ? 1 : 0);
      } else if (typeof value === 'number') {
        setUniformValue(programManager, `u${key[0].toUpperCase()}${key.slice(1)}`, value);
      }
    }
  }

  setupTextures(controller: BaseFilterController, textures: unknown[]): void {
    if (controller.metadata.id !== 'DisplacementFilter') {
      return;
    }

    const textureKey = typeof controller.uniforms.textureKey === 'string' ? controller.uniforms.textureKey : 'map';
    const frame = controller.camera?.scene?.sys.textures.getFrame(textureKey);

    textures[1] = frame?.glTexture ?? textures[0];
  }
}

export const addControllerToTarget = <T extends BaseFilterController>(
  target: PhaserFilterTarget | Phaser.Cameras.Scene2D.Camera,
  Controller: FilterControllerConstructor<T>,
  options: Record<string, unknown> = {},
  space: FilterSpace = 'internal',
): T => {
  const camera = 'filterCamera' in target && target.filterCamera
    ? target.filterCamera
    : 'scene' in target && target.scene
      ? target.scene.cameras.main
      : target as Phaser.Cameras.Scene2D.Camera;

  const controller = new Controller(camera, options);

  if ('enableFilters' in target && typeof target.enableFilters === 'function') {
    target.enableFilters();
  }

  const filterList = 'filters' in target ? target.filters : undefined;
  const destination = filterList?.[space] ?? filterList?.internal ?? filterList?.external;

  if (destination?.add) {
    destination.add(controller);
  }

  return controller;
};
