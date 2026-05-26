import Phaser from 'phaser';
import { GUI } from 'lil-gui';
import {
  BaseFilterController,
  FILTER_ADDERS,
  FILTER_METADATA,
  FILTER_METADATA_BY_ID,
  normalizeColor,
  registerPhaserFilters,
  type FilterMetadata,
} from '../src';
import './style.css';

interface Fish extends Phaser.GameObjects.Image {
  direction: number;
  speed: number;
  turnSpeed: number;
  activeFilters: BaseFilterController[];
}

const ASSET_BASE = '/assets/';
const FISH_COUNT = 20;
const FISH_VARIATIONS = 5;

const getEnabledFilters = (): string[] => {
  const params = new URLSearchParams(window.location.search);
  const raw = params.get('filters') ?? params.get('filter') ?? '';
  return raw.split(',').map((item) => item.trim()).filter(Boolean);
};

class DemoScene extends Phaser.Scene {
  private gui!: GUI;
  private pond!: Phaser.GameObjects.Container;
  private background!: Phaser.GameObjects.Image;
  private overlay!: Phaser.GameObjects.TileSprite;
  private fish: Fish[] = [];
  private pondFilters: BaseFilterController[] = [];
  private filterState = new Map<string, BaseFilterController[]>();
  private animating = true;
  private rendering = true;
  private showFps = false;
  private timer = 0;
  private fpsUpdateTimer = 0;
  private status!: HTMLDivElement;
  private fpsCounter!: HTMLDivElement;
  private enabledFromQuery = getEnabledFilters();

  constructor() {
    super('DemoScene');
  }

  preload(): void {
    this.load.image('background', `${ASSET_BASE}displacement_BG.jpg`);
    this.load.image('overlay', `${ASSET_BASE}overlay.png`);
    this.load.image('map', `${ASSET_BASE}displacement_map.png`);
    this.load.image('lightmap', `${ASSET_BASE}lightmap.png`);
    this.load.image('colormap', `${ASSET_BASE}colormap.png`);

    for (let index = 1; index <= FISH_VARIATIONS; index += 1) {
      this.load.image(`fish${index}`, `${ASSET_BASE}displacement_fish${index}.png`);
    }
  }

  create(): void {
    registerPhaserFilters(this);

    this.gui = new GUI({ title: 'Phaser 4 Filters' });
    const demoSettings = {
      rendering: this.rendering,
      animating: this.animating,
      showFps: this.showFps,
    };

    this.gui.add(demoSettings, 'rendering').name('Rendering').onChange((value: boolean) => {
      this.rendering = value;
      if (value) {
        this.game.loop.wake(true);
      } else {
        this.game.loop.sleep();
      }
    });
    this.gui.add(demoSettings, 'animating').name('Animating').onChange((value: boolean) => {
      this.animating = value;
    });
    this.gui.add(demoSettings, 'showFps').name('FPS Counter').onChange((value: boolean) => {
      this.showFps = value;
      this.fpsCounter.hidden = !value;
    });

    this.pond = this.add.container(0, 0);
    this.pond.enableFilters();

    this.background = this.add.image(0, 0, 'background').setOrigin(0);
    this.pond.add(this.background);

    for (let index = 0; index < FISH_COUNT; index += 1) {
      const fish = this.add.image(0, 0, `fish${(index % FISH_VARIATIONS) + 1}`) as Fish;
      fish.setOrigin(0.5);
      fish.enableFilters();
      fish.direction = Math.random() * Math.PI * 2;
      fish.speed = 2 + Math.random() * 2;
      fish.turnSpeed = Math.random() - 0.8;
      fish.activeFilters = [];
      fish.setScale(0.8 + Math.random() * 0.3);
      this.pond.add(fish);
      this.fish.push(fish);
    }

    this.overlay = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, 'overlay').setOrigin(0);
    this.pond.add(this.overlay);

    this.status = document.createElement('div');
    this.status.className = 'demo-status';
    document.body.appendChild(this.status);

    this.fpsCounter = document.createElement('div');
    this.fpsCounter.className = 'demo-fps';
    this.fpsCounter.hidden = !this.showFps;
    this.fpsCounter.textContent = 'FPS: --';
    document.body.appendChild(this.fpsCounter);

    this.scale.on('resize', this.resize, this);
    this.resize();
    this.createFilterGui();
    this.updateStatus();

    (window as unknown as { __phaserFiltersDemo?: DemoScene }).__phaserFiltersDemo = this;
  }

  override update(_time: number, delta: number): void {
    this.timer += delta / 16.6667;
    this.updateFpsCounter(delta);

    for (const controllers of this.filterState.values()) {
      for (const controller of controllers) {
        if (controller.metadata.id === 'ShockwaveFilter') {
          if (controller.uniforms.animating !== false) {
            const time = (Number(controller.uniforms.time ?? 0) + delta / 1000) % 2.5;

            controller.uniforms.time = time;
            (controller as unknown as { time: number }).time = time;
          }

          continue;
        }

        if (controller.metadata.id === 'ReflectionFilter') {
          if (controller.uniforms.animating !== false) {
            const time = Number(controller.uniforms.time ?? 0) + delta / 166.667;

            controller.uniforms.time = time;
            (controller as unknown as { time: number }).time = time;
          }

          continue;
        }

        if ('time' in controller.uniforms) {
          controller.uniforms.time = this.timer;
          (controller as unknown as { time: number }).time = this.timer;
        }

        if (controller.metadata.id === 'OldFilmFilter') {
          const seed = Math.random();

          controller.uniforms.seed = seed;
          (controller as unknown as { seed: number }).seed = seed;
        }
      }
    }

    if (!this.animating) {
      return;
    }

    const width = this.scale.width;
    const height = this.scale.height;
    const padding = 100;

    this.overlay.tilePositionX = -this.timer;
    this.overlay.tilePositionY = -this.timer;

    for (const fish of this.fish) {
      fish.direction += fish.turnSpeed * 0.01;
      fish.x += Math.sin(fish.direction) * fish.speed;
      fish.y += Math.cos(fish.direction) * fish.speed;
      fish.rotation = -fish.direction - Math.PI / 2;

      if (fish.x < -padding) fish.x += width + padding * 2;
      if (fish.x > width + padding) fish.x -= width + padding * 2;
      if (fish.y < -padding) fish.y += height + padding * 2;
      if (fish.y > height + padding) fish.y -= height + padding * 2;
    }
  }

  private updateFpsCounter(delta: number): void {
    if (!this.showFps) {
      return;
    }

    this.fpsUpdateTimer += delta;

    if (this.fpsUpdateTimer < 250) {
      return;
    }

    this.fpsUpdateTimer = 0;
    this.fpsCounter.textContent = `FPS: ${Math.round(this.game.loop.actualFps)}`;
  }

  private resize(): void {
    const width = this.scale.width;
    const height = this.scale.height;
    const bgTexture = this.textures.get('background').getSourceImage() as HTMLImageElement;
    const bgAspect = bgTexture.width / bgTexture.height;
    const viewAspect = width / height;

    if (viewAspect > bgAspect) {
      this.background.displayWidth = width;
      this.background.displayHeight = width / bgAspect;
    } else {
      this.background.displayHeight = height;
      this.background.displayWidth = height * bgAspect;
    }

    this.background.x = (width - this.background.displayWidth) / 2;
    this.background.y = (height - this.background.displayHeight) / 2;
    this.overlay.setSize(width, height);

    for (const fish of this.fish) {
      if (fish.x === 0 && fish.y === 0) {
        fish.x = Math.random() * width;
        fish.y = Math.random() * height;
      }
    }
  }

  private createFilterGui(): void {
    const querySet = new Set(this.enabledFromQuery);
    let enabledOneDefault = querySet.size > 0;

    for (const metadata of FILTER_METADATA) {
      const folder = this.gui.addFolder(metadata.displayName).close();
      const defaults = metadata.defaults as Record<string, unknown>;
      const settings = {
        enabled: querySet.has(metadata.id) || (!enabledOneDefault && metadata.id === 'AdjustmentFilter'),
      };
      const setFolderEnabled = (enabled: boolean): void => {
        folder.domElement.classList.toggle('filter-enabled', enabled);
      };

      if (settings.enabled) {
        enabledOneDefault = true;
      }

      folder.add(settings, 'enabled').name('Enabled').onChange((enabled: boolean) => {
        this.toggleFilter(metadata, enabled);
        setFolderEnabled(enabled);
        this.updateStatus();
      });

      if (metadata.id === 'ColorGradientFilter') {
        this.createColorGradientGui(folder, metadata);
        if (settings.enabled) {
          this.toggleFilter(metadata, true);
          folder.open();
        }
        continue;
      }

      for (const control of metadata.controls) {
        if (control.type === 'boolean') {
          folder.add(defaults, control.key).name(control.key).onChange(() => this.refreshFilter(metadata));
        } else if (control.type === 'color') {
          const proxy = { [control.key]: normalizeColor(defaults[control.key]) };
          folder.addColor(proxy, control.key).name(control.key).onChange((value: number) => {
            defaults[control.key] = value;
            this.refreshFilter(metadata);
          });
        } else {
          folder.add(defaults, control.key, control.min, control.max, Number(('step' in control ? control.step : undefined) ?? 0.01))
            .name(control.key)
            .onChange(() => this.refreshFilter(metadata));
        }
      }

      if (settings.enabled) {
        this.toggleFilter(metadata, true);
        setFolderEnabled(true);
        folder.open();
      }
    }
  }

  private createColorGradientGui(folder: GUI, metadata: FilterMetadata): void {
    const defaults = metadata.defaults as Record<string, unknown> & {
      type: number;
      alpha: number;
      angle: number;
      maxColors: number;
      replace: boolean;
      stops: Array<{ offset: number; color: number | string | number[]; alpha: number }>;
    };

    const apply = (): void => this.refreshFilter(metadata);

    folder.add(defaults, 'type', { LINEAR: 0, RADIAL: 1, CONIC: 2 }).name('type').onChange(apply);
    folder.add(defaults, 'alpha', 0, 1, 0.01).name('alpha').onChange(apply);
    folder.add(defaults, 'angle', 0, 360, 1).name('angle').onChange(apply);
    folder.add(defaults, 'maxColors', 0, 24, 1).name('maxColors').onChange(apply);
    folder.add(defaults, 'replace').name('replace').onChange(apply);

    const stopActions = {
      add: (): void => {
        if (defaults.stops.length >= 16) {
          return;
        }

        const last = defaults.stops[defaults.stops.length - 1];
        defaults.stops.push({
          offset: 1,
          color: last?.color ?? 0xffffff,
          alpha: 1,
        });
        rebuildStops();
        apply();
      },
      remove: (): void => {
        if (defaults.stops.length <= 2) {
          return;
        }

        defaults.stops.pop();
        rebuildStops();
        apply();
      },
    };

    folder.add(stopActions, 'add').name('add color stop');
    folder.add(stopActions, 'remove').name('remove color stop');

    let stopsFolder: GUI | null = null;

    const rebuildStops = (): void => {
      stopsFolder?.destroy();
      stopsFolder = folder.addFolder('stops').open();

      defaults.stops.forEach((stop, index) => {
        const stopFolder = stopsFolder!.addFolder(`stop ${index}`).close();

        stopFolder.addColor(stop, 'color').name('color').onChange(apply);
        stopFolder.add(stop, 'offset', 0, 1, 0.01).name('offset').onChange(apply);
        stopFolder.add(stop, 'alpha', 0, 1, 0.01).name('alpha').onChange(apply);
      });
    };

    rebuildStops();
  }

  private toggleFilter(metadata: FilterMetadata, enabled: boolean): void {
    const existing = this.filterState.get(metadata.id) ?? [];

    if (!enabled) {
      this.removeControllers(existing);
      this.filterState.delete(metadata.id);
      return;
    }

    if (existing.length > 0) {
      for (const controller of existing) {
        controller.enabled = true;
        Object.assign(controller, metadata.defaults);
      }
      return;
    }

    const addFilter = FILTER_ADDERS[metadata.id as keyof typeof FILTER_ADDERS] as (
      target: Phaser.GameObjects.GameObject | Phaser.Cameras.Scene2D.Camera,
      options: Record<string, unknown>,
      space: 'internal' | 'external',
    ) => BaseFilterController;
    const controllers: BaseFilterController[] = [];

    if (metadata.fishOnly) {
      for (const fish of this.fish) {
        const controller = addFilter(fish, { ...metadata.defaults }, 'internal');
        controller.enabled = true;
        fish.activeFilters.push(controller);
        controllers.push(controller);
      }
    } else {
      const controller = addFilter(this.pond, { ...metadata.defaults }, 'external');
      controller.enabled = true;
      this.pondFilters.push(controller);
      controllers.push(controller);
    }

    this.filterState.set(metadata.id, controllers);
  }

  private removeControllers(controllers: BaseFilterController[]): void {
    for (const controller of controllers) {
      controller.enabled = false;

      for (const fish of this.fish) {
        this.removeControllerFromFilterLists(fish, controller);
        fish.activeFilters = fish.activeFilters.filter((item) => item !== controller);
      }

      this.removeControllerFromFilterLists(this.pond, controller);
      this.pondFilters = this.pondFilters.filter((item) => item !== controller);
    }
  }

  private removeControllerFromFilterLists(
    target: Phaser.GameObjects.GameObject,
    controller: BaseFilterController,
  ): void {
    const filters = (target as unknown as { filters?: {
      internal?: { remove: (item: BaseFilterController, forceDestroy?: boolean) => unknown };
      external?: { remove: (item: BaseFilterController, forceDestroy?: boolean) => unknown };
    } | null }).filters;

    filters?.internal?.remove(controller, true);
    filters?.external?.remove(controller, true);
  }

  private refreshFilter(metadata: FilterMetadata): void {
    const controllers = this.filterState.get(metadata.id);

    if (!controllers) {
      return;
    }

    for (const controller of controllers) {
      Object.assign(controller, metadata.defaults);
      Object.assign(controller.uniforms, metadata.defaults);
    }
  }

  private updateStatus(): void {
    const enabled = [...this.filterState.keys()]
      .map((id) => FILTER_METADATA_BY_ID[id]?.displayName ?? id)
      .join(', ');
    this.status.textContent = enabled ? `Enabled: ${enabled}` : 'No filters enabled';
  }
}

const game = new Phaser.Game({
  type: Phaser.WEBGL,
  parent: 'app',
  backgroundColor: '#071015',
  width: window.innerWidth,
  height: window.innerHeight,
  scale: {
    mode: Phaser.Scale.RESIZE,
    parent: 'app',
    width: '100%',
    height: '100%',
  },
  scene: DemoScene,
});

window.addEventListener('beforeunload', () => game.destroy(true));
