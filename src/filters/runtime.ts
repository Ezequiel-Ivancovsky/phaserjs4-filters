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
