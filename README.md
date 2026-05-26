# PhaserJS Filters

Phaser 4 filter controllers, WebGL render nodes, shaders, and a Vite demo ported from the MIT-licensed [PixiJS Filters](https://github.com/pixijs/filters) project.

This project uses PixiJS Filters as the base for the filter catalog, shader behavior, option names, defaults, and demo interactions where practical. The port targets Phaser 4's filter architecture: `Phaser.Filters.Controller` plus `Phaser.Renderer.WebGL.RenderNodes.BaseFilterShader`.

See [NOTICE](./NOTICE) for third-party attribution.

## Compatibility

| Phaser | phaserjs-filters |
|--------|------------------|
| v4.1.x | v0.1.x           |

Only Phaser's WebGL renderer is supported. Canvas fallback is out of scope.

## Installation

Install dependencies:

```bash
npm install
```

Run the Vite demo:

```bash
npm run dev
```

Build and type-check:

```bash
npm run build
```

Run tests:

```bash
npm test
```

## Demo

The demo recreates the PixiJS Filters fish pond demo with Phaser 4. It includes:

- a Phaser scene with background, fish sprites, and animated overlay;
- lil-gui controls for enabling filters and changing uniforms;
- query-string support such as `?filters=GlowFilter,ShockwaveFilter`;
- fish-only filters for effects that should apply to sprites rather than the whole pond;
- filter enable states highlighted in the GUI.

## Usage

Register render nodes once in a scene, then add controllers to a game object or camera-like target.

```ts
import {
  addGlowFilter,
  registerPhaserFilters,
} from './src';

class DemoScene extends Phaser.Scene {
  create() {
    registerPhaserFilters(this);

    const fish = this.add.image(400, 300, 'fish');
    fish.enableFilters();

    addGlowFilter(fish, {
      distance: 15,
      outerStrength: 2,
      color: 0xffffff,
    }, 'internal');
  }
}
```

Filter classes and helpers are exported from `src/index.ts`.

## Filters

These Phaser filters are based on PixiJS Filters and keep Pixi option names/defaults where practical.

| Filter | Source |
|--------|--------|
| `AdjustmentFilter` | `pixi-filters/adjustment` |
| `AdvancedBloomFilter` | `pixi-filters/advanced-bloom` |
| `AsciiFilter` | `pixi-filters/ascii` |
| `BackdropBlurFilter` | `pixi-filters/backdrop-blur` |
| `BevelFilter` | `pixi-filters/bevel` |
| `BloomFilter` | `pixi-filters/bloom` |
| `BulgePinchFilter` | `pixi-filters/bulge-pinch` |
| `ColorGradientFilter` | `pixi-filters/color-gradient` |
| `ColorMapFilter` | `pixi-filters/color-map` |
| `ColorOverlayFilter` | `pixi-filters/color-overlay` |
| `ColorReplaceFilter` | `pixi-filters/color-replace` |
| `ConvolutionFilter` | `pixi-filters/convolution` |
| `CrossHatchFilter` | `pixi-filters/cross-hatch` |
| `CRTFilter` | `pixi-filters/crt` |
| `DotFilter` | `pixi-filters/dot` |
| `DropShadowFilter` | `pixi-filters/drop-shadow` |
| `EmbossFilter` | `pixi-filters/emboss` |
| `GlitchFilter` | `pixi-filters/glitch` |
| `GlowFilter` | `pixi-filters/glow` |
| `GodrayFilter` | `pixi-filters/godray` |
| `GrayscaleFilter` | `pixi-filters/grayscale` |
| `HslAdjustmentFilter` | `pixi-filters/hsl-adjustment` |
| `KawaseBlurFilter` | `pixi-filters/kawase-blur` |
| `MotionBlurFilter` | `pixi-filters/motion-blur` |
| `MultiColorReplaceFilter` | `pixi-filters/multi-color-replace` |
| `OldFilmFilter` | `pixi-filters/old-film` |
| `OutlineFilter` | `pixi-filters/outline` |
| `PixelateFilter` | `pixi-filters/pixelate` |
| `RadialBlurFilter` | `pixi-filters/radial-blur` |
| `ReflectionFilter` | `pixi-filters/reflection` |
| `RGBSplitFilter` | `pixi-filters/rgb-split` |
| `ShockwaveFilter` | `pixi-filters/shockwave` |
| `SimpleLightmapFilter` | `pixi-filters/simple-lightmap` |
| `SimplexNoiseFilter` | `pixi-filters/simplex-noise` |
| `TiltShiftFilter` | `pixi-filters/tilt-shift` |
| `TwistFilter` | `pixi-filters/twist` |
| `ZoomBlurFilter` | `pixi-filters/zoom-blur` |

## Demo Extras

These compatibility filters are included for the demo because the original PixiJS demo also exposes built-in Pixi filters.

| Filter |
|--------|
| `AlphaFilter` |
| `BlurFilter` |
| `ColorMatrixFilter` |
| `DisplacementFilter` |
| `NoiseFilter` |

## Project Structure

| Path | Purpose |
|------|---------|
| `src/filters/<filter-name>` | One folder per filter with `FilterName.ts`, `<filter-name>.frag`, and `index.ts` |
| `src/filters/generated.ts` | Generated aggregate exports, metadata registry, adders, and render-node registration |
| `src/filters/runtime.ts` | Shared Phaser controller/render-node helpers |
| `scripts/generate-filters.mjs` | Generates the per-filter folders, shaders, classes, and metadata |
| `demo` | Phaser 4 Vite demo scene and styles |
| `public/assets` | Demo assets derived from the PixiJS Filters demo |
| `tests` | Lightweight metadata and helper tests |

## License And Attribution

This project is MIT licensed.

It is based on [PixiJS Filters](https://github.com/pixijs/filters), which is also MIT licensed. Filter behavior, option naming, demo structure, and demo assets were used as the base for this Phaser 4 port. PixiJS Filters remains copyright of the PixiJS team and contributors.

See [NOTICE](./NOTICE) for attribution details.
