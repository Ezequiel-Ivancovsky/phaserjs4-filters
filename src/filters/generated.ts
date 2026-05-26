import Phaser from 'phaser';
import { FilterMetadata } from './runtime';
import {
  AdjustmentFilter,
  AdjustmentFilterMetadata,
  PhaserAdjustmentFilter,
  addAdjustmentFilter,
} from './adjustment';
import {
  AdvancedBloomFilter,
  AdvancedBloomFilterMetadata,
  PhaserAdvancedBloomFilter,
  addAdvancedBloomFilter,
} from './advanced-bloom';
import {
  AsciiFilter,
  AsciiFilterMetadata,
  PhaserAsciiFilter,
  addAsciiFilter,
} from './ascii';
import {
  BackdropBlurFilter,
  BackdropBlurFilterMetadata,
  PhaserBackdropBlurFilter,
  addBackdropBlurFilter,
} from './backdrop-blur';
import {
  BevelFilter,
  BevelFilterMetadata,
  PhaserBevelFilter,
  addBevelFilter,
} from './bevel';
import {
  BloomFilter,
  BloomFilterMetadata,
  PhaserBloomFilter,
  addBloomFilter,
} from './bloom';
import {
  BulgePinchFilter,
  BulgePinchFilterMetadata,
  PhaserBulgePinchFilter,
  addBulgePinchFilter,
} from './bulge-pinch';
import {
  ColorGradientFilter,
  ColorGradientFilterMetadata,
  PhaserColorGradientFilter,
  addColorGradientFilter,
} from './color-gradient';
import {
  ColorMapFilter,
  ColorMapFilterMetadata,
  PhaserColorMapFilter,
  addColorMapFilter,
} from './color-map';
import {
  ColorOverlayFilter,
  ColorOverlayFilterMetadata,
  PhaserColorOverlayFilter,
  addColorOverlayFilter,
} from './color-overlay';
import {
  ColorReplaceFilter,
  ColorReplaceFilterMetadata,
  PhaserColorReplaceFilter,
  addColorReplaceFilter,
} from './color-replace';
import {
  ConvolutionFilter,
  ConvolutionFilterMetadata,
  PhaserConvolutionFilter,
  addConvolutionFilter,
} from './convolution';
import {
  CrossHatchFilter,
  CrossHatchFilterMetadata,
  PhaserCrossHatchFilter,
  addCrossHatchFilter,
} from './cross-hatch';
import {
  CRTFilter,
  CRTFilterMetadata,
  PhaserCRTFilter,
  addCRTFilter,
} from './crt';
import {
  DotFilter,
  DotFilterMetadata,
  PhaserDotFilter,
  addDotFilter,
} from './dot';
import {
  DropShadowFilter,
  DropShadowFilterMetadata,
  PhaserDropShadowFilter,
  addDropShadowFilter,
} from './drop-shadow';
import {
  EmbossFilter,
  EmbossFilterMetadata,
  PhaserEmbossFilter,
  addEmbossFilter,
} from './emboss';
import {
  GlitchFilter,
  GlitchFilterMetadata,
  PhaserGlitchFilter,
  addGlitchFilter,
} from './glitch';
import {
  GlowFilter,
  GlowFilterMetadata,
  PhaserGlowFilter,
  addGlowFilter,
} from './glow';
import {
  GodrayFilter,
  GodrayFilterMetadata,
  PhaserGodrayFilter,
  addGodrayFilter,
} from './godray';
import {
  GrayscaleFilter,
  GrayscaleFilterMetadata,
  PhaserGrayscaleFilter,
  addGrayscaleFilter,
} from './grayscale';
import {
  HslAdjustmentFilter,
  HslAdjustmentFilterMetadata,
  PhaserHslAdjustmentFilter,
  addHslAdjustmentFilter,
} from './hsl-adjustment';
import {
  KawaseBlurFilter,
  KawaseBlurFilterMetadata,
  PhaserKawaseBlurFilter,
  addKawaseBlurFilter,
} from './kawase-blur';
import {
  MotionBlurFilter,
  MotionBlurFilterMetadata,
  PhaserMotionBlurFilter,
  addMotionBlurFilter,
} from './motion-blur';
import {
  MultiColorReplaceFilter,
  MultiColorReplaceFilterMetadata,
  PhaserMultiColorReplaceFilter,
  addMultiColorReplaceFilter,
} from './multi-color-replace';
import {
  OldFilmFilter,
  OldFilmFilterMetadata,
  PhaserOldFilmFilter,
  addOldFilmFilter,
} from './old-film';
import {
  OutlineFilter,
  OutlineFilterMetadata,
  PhaserOutlineFilter,
  addOutlineFilter,
} from './outline';
import {
  PixelateFilter,
  PixelateFilterMetadata,
  PhaserPixelateFilter,
  addPixelateFilter,
} from './pixelate';
import {
  RadialBlurFilter,
  RadialBlurFilterMetadata,
  PhaserRadialBlurFilter,
  addRadialBlurFilter,
} from './radial-blur';
import {
  ReflectionFilter,
  ReflectionFilterMetadata,
  PhaserReflectionFilter,
  addReflectionFilter,
} from './reflection';
import {
  RGBSplitFilter,
  RGBSplitFilterMetadata,
  PhaserRGBSplitFilter,
  addRGBSplitFilter,
} from './rgb-split';
import {
  ShockwaveFilter,
  ShockwaveFilterMetadata,
  PhaserShockwaveFilter,
  addShockwaveFilter,
} from './shockwave';
import {
  SimpleLightmapFilter,
  SimpleLightmapFilterMetadata,
  PhaserSimpleLightmapFilter,
  addSimpleLightmapFilter,
} from './simple-lightmap';
import {
  SimplexNoiseFilter,
  SimplexNoiseFilterMetadata,
  PhaserSimplexNoiseFilter,
  addSimplexNoiseFilter,
} from './simplex-noise';
import {
  TiltShiftFilter,
  TiltShiftFilterMetadata,
  PhaserTiltShiftFilter,
  addTiltShiftFilter,
} from './tilt-shift';
import {
  TwistFilter,
  TwistFilterMetadata,
  PhaserTwistFilter,
  addTwistFilter,
} from './twist';
import {
  ZoomBlurFilter,
  ZoomBlurFilterMetadata,
  PhaserZoomBlurFilter,
  addZoomBlurFilter,
} from './zoom-blur';
import {
  AlphaFilter,
  AlphaFilterMetadata,
  PhaserAlphaFilter,
  addAlphaFilter,
} from './alpha';
import {
  BlurFilter,
  BlurFilterMetadata,
  PhaserBlurFilter,
  addBlurFilter,
} from './blur';
import {
  ColorMatrixFilter,
  ColorMatrixFilterMetadata,
  PhaserColorMatrixFilter,
  addColorMatrixFilter,
} from './color-matrix';
import {
  DisplacementFilter,
  DisplacementFilterMetadata,
  PhaserDisplacementFilter,
  addDisplacementFilter,
} from './displacement';
import {
  NoiseFilter,
  NoiseFilterMetadata,
  PhaserNoiseFilter,
  addNoiseFilter,
} from './noise';

export * from './adjustment';
export * from './advanced-bloom';
export * from './ascii';
export * from './backdrop-blur';
export * from './bevel';
export * from './bloom';
export * from './bulge-pinch';
export * from './color-gradient';
export * from './color-map';
export * from './color-overlay';
export * from './color-replace';
export * from './convolution';
export * from './cross-hatch';
export * from './crt';
export * from './dot';
export * from './drop-shadow';
export * from './emboss';
export * from './glitch';
export * from './glow';
export * from './godray';
export * from './grayscale';
export * from './hsl-adjustment';
export * from './kawase-blur';
export * from './motion-blur';
export * from './multi-color-replace';
export * from './old-film';
export * from './outline';
export * from './pixelate';
export * from './radial-blur';
export * from './reflection';
export * from './rgb-split';
export * from './shockwave';
export * from './simple-lightmap';
export * from './simplex-noise';
export * from './tilt-shift';
export * from './twist';
export * from './zoom-blur';
export * from './alpha';
export * from './blur';
export * from './color-matrix';
export * from './displacement';
export * from './noise';

export const FILTER_METADATA = ([
  AdjustmentFilterMetadata,
  AdvancedBloomFilterMetadata,
  AsciiFilterMetadata,
  BackdropBlurFilterMetadata,
  BevelFilterMetadata,
  BloomFilterMetadata,
  BulgePinchFilterMetadata,
  ColorGradientFilterMetadata,
  ColorMapFilterMetadata,
  ColorOverlayFilterMetadata,
  ColorReplaceFilterMetadata,
  ConvolutionFilterMetadata,
  CrossHatchFilterMetadata,
  CRTFilterMetadata,
  DotFilterMetadata,
  DropShadowFilterMetadata,
  EmbossFilterMetadata,
  GlitchFilterMetadata,
  GlowFilterMetadata,
  GodrayFilterMetadata,
  GrayscaleFilterMetadata,
  HslAdjustmentFilterMetadata,
  KawaseBlurFilterMetadata,
  MotionBlurFilterMetadata,
  MultiColorReplaceFilterMetadata,
  OldFilmFilterMetadata,
  OutlineFilterMetadata,
  PixelateFilterMetadata,
  RadialBlurFilterMetadata,
  ReflectionFilterMetadata,
  RGBSplitFilterMetadata,
  ShockwaveFilterMetadata,
  SimpleLightmapFilterMetadata,
  SimplexNoiseFilterMetadata,
  TiltShiftFilterMetadata,
  TwistFilterMetadata,
  ZoomBlurFilterMetadata,
  AlphaFilterMetadata,
  BlurFilterMetadata,
  ColorMatrixFilterMetadata,
  DisplacementFilterMetadata,
  NoiseFilterMetadata,
] satisfies FilterMetadata[]).sort((a, b) => a.displayName.localeCompare(b.displayName));

export const FILTER_METADATA_BY_ID = Object.fromEntries(FILTER_METADATA.map((item) => [item.id, item])) as Record<string, FilterMetadata>;

export const FILTER_RENDER_NODES = {
  PhaserAdjustmentFilter,
  PhaserAdvancedBloomFilter,
  PhaserAsciiFilter,
  PhaserBackdropBlurFilter,
  PhaserBevelFilter,
  PhaserBloomFilter,
  PhaserBulgePinchFilter,
  PhaserColorGradientFilter,
  PhaserColorMapFilter,
  PhaserColorOverlayFilter,
  PhaserColorReplaceFilter,
  PhaserConvolutionFilter,
  PhaserCrossHatchFilter,
  PhaserCRTFilter,
  PhaserDotFilter,
  PhaserDropShadowFilter,
  PhaserEmbossFilter,
  PhaserGlitchFilter,
  PhaserGlowFilter,
  PhaserGodrayFilter,
  PhaserGrayscaleFilter,
  PhaserHslAdjustmentFilter,
  PhaserKawaseBlurFilter,
  PhaserMotionBlurFilter,
  PhaserMultiColorReplaceFilter,
  PhaserOldFilmFilter,
  PhaserOutlineFilter,
  PhaserPixelateFilter,
  PhaserRadialBlurFilter,
  PhaserReflectionFilter,
  PhaserRGBSplitFilter,
  PhaserShockwaveFilter,
  PhaserSimpleLightmapFilter,
  PhaserSimplexNoiseFilter,
  PhaserTiltShiftFilter,
  PhaserTwistFilter,
  PhaserZoomBlurFilter,
  PhaserAlphaFilter,
  PhaserBlurFilter,
  PhaserColorMatrixFilter,
  PhaserDisplacementFilter,
  PhaserNoiseFilter,
};

export const FILTER_CONTROLLERS = {
  AdjustmentFilter,
  AdvancedBloomFilter,
  AsciiFilter,
  BackdropBlurFilter,
  BevelFilter,
  BloomFilter,
  BulgePinchFilter,
  ColorGradientFilter,
  ColorMapFilter,
  ColorOverlayFilter,
  ColorReplaceFilter,
  ConvolutionFilter,
  CrossHatchFilter,
  CRTFilter,
  DotFilter,
  DropShadowFilter,
  EmbossFilter,
  GlitchFilter,
  GlowFilter,
  GodrayFilter,
  GrayscaleFilter,
  HslAdjustmentFilter,
  KawaseBlurFilter,
  MotionBlurFilter,
  MultiColorReplaceFilter,
  OldFilmFilter,
  OutlineFilter,
  PixelateFilter,
  RadialBlurFilter,
  ReflectionFilter,
  RGBSplitFilter,
  ShockwaveFilter,
  SimpleLightmapFilter,
  SimplexNoiseFilter,
  TiltShiftFilter,
  TwistFilter,
  ZoomBlurFilter,
  AlphaFilter,
  BlurFilter,
  ColorMatrixFilter,
  DisplacementFilter,
  NoiseFilter,
};

export const FILTER_ADDERS = {
  AdjustmentFilter: addAdjustmentFilter,
  AdvancedBloomFilter: addAdvancedBloomFilter,
  AsciiFilter: addAsciiFilter,
  BackdropBlurFilter: addBackdropBlurFilter,
  BevelFilter: addBevelFilter,
  BloomFilter: addBloomFilter,
  BulgePinchFilter: addBulgePinchFilter,
  ColorGradientFilter: addColorGradientFilter,
  ColorMapFilter: addColorMapFilter,
  ColorOverlayFilter: addColorOverlayFilter,
  ColorReplaceFilter: addColorReplaceFilter,
  ConvolutionFilter: addConvolutionFilter,
  CrossHatchFilter: addCrossHatchFilter,
  CRTFilter: addCRTFilter,
  DotFilter: addDotFilter,
  DropShadowFilter: addDropShadowFilter,
  EmbossFilter: addEmbossFilter,
  GlitchFilter: addGlitchFilter,
  GlowFilter: addGlowFilter,
  GodrayFilter: addGodrayFilter,
  GrayscaleFilter: addGrayscaleFilter,
  HslAdjustmentFilter: addHslAdjustmentFilter,
  KawaseBlurFilter: addKawaseBlurFilter,
  MotionBlurFilter: addMotionBlurFilter,
  MultiColorReplaceFilter: addMultiColorReplaceFilter,
  OldFilmFilter: addOldFilmFilter,
  OutlineFilter: addOutlineFilter,
  PixelateFilter: addPixelateFilter,
  RadialBlurFilter: addRadialBlurFilter,
  ReflectionFilter: addReflectionFilter,
  RGBSplitFilter: addRGBSplitFilter,
  ShockwaveFilter: addShockwaveFilter,
  SimpleLightmapFilter: addSimpleLightmapFilter,
  SimplexNoiseFilter: addSimplexNoiseFilter,
  TiltShiftFilter: addTiltShiftFilter,
  TwistFilter: addTwistFilter,
  ZoomBlurFilter: addZoomBlurFilter,
  AlphaFilter: addAlphaFilter,
  BlurFilter: addBlurFilter,
  ColorMatrixFilter: addColorMatrixFilter,
  DisplacementFilter: addDisplacementFilter,
  NoiseFilter: addNoiseFilter,
};

export const registerPhaserFilters = (scene: Phaser.Scene): void => {
  const renderNodes = (scene.renderer as Phaser.Renderer.WebGL.WebGLRenderer).renderNodes;
  for (const [name, NodeConstructor] of Object.entries(FILTER_RENDER_NODES)) {
    if (!renderNodes.hasNode(name)) {
      renderNodes.addNodeConstructor(name, NodeConstructor);
    }
  }
};

export const getFilterMetadata = (id: string): FilterMetadata | undefined => FILTER_METADATA_BY_ID[id];
