/* eslint-disable max-classes-per-file */
import Phaser from 'phaser';
import { addControllerToTarget, BaseFilterController, FilterMetadata, FilterSpace, hexToRgb, normalizeColor, PhaserFilterTarget } from './runtime';
import { makeFragment } from './shaders';

type Manager = Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager;
type DrawingContext = Phaser.Renderer.WebGL.DrawingContext;

const FILTER_BODIES = {
  AdjustmentFilter: "color.rgb = pow(max(color.rgb, vec3(0.0)), vec3(1.0 / max(uGamma, 0.0001))); float gray = luma(color.rgb); color.rgb = mix(vec3(gray), color.rgb, uSaturation); color.rgb = ((color.rgb - 0.5) * uContrast + 0.5) * vec3(uRed, uGreen, uBlue) * uBrightness; color.a *= uAlpha; gl_FragColor = color;",
  AdvancedBloomFilter: "float b = smoothstep(uThreshold, 1.0, luma(color.rgb)); vec3 glow = vec3(0.0); for (int x = -4; x <= 4; x++) { for (int y = -4; y <= 4; y++) { vec2 o = vec2(float(x), float(y)) * uBlur / max(uResolution, vec2(1.0)); glow += readInput(uv + o).rgb; }} glow /= 81.0; color.rgb = color.rgb * uBrightness + glow * b * uBloomScale; gl_FragColor = color;",
  AsciiFilter: "vec2 cell = max(vec2(uSize), vec2(1.0)) / max(uResolution, vec2(1.0)); vec2 snapped = (floor(uv / cell) + 0.5) * cell; float shade = luma(readInput(snapped).rgb); float stripe = step(fract((uv.x + uv.y) * uResolution.x / max(uSize, 1.0)), shade); gl_FragColor = vec4(vec3(stripe * shade), color.a);",
  BackdropBlurFilter: "vec3 sum = vec3(0.0); for (int i = -4; i <= 4; i++) { vec2 o = vec2(float(i)) * uStrength / max(uResolution, vec2(1.0)); sum += readInput(uv + o).rgb; } color.rgb = sum / 9.0; gl_FragColor = color;",
  BevelFilter: "vec2 transform = vec2(cos(radians(uRotation)), sin(radians(uRotation))) * uThickness / max(uResolution, vec2(1.0)); vec4 base = readInput(uv); float light = readInput(uv - transform).a; float shadow = readInput(uv + transform).a; vec3 lightColor = vec3(uLightColorR, uLightColorG, uLightColorB); vec3 shadowColor = vec3(uShadowColorR, uShadowColorG, uShadowColorB); base.rgb = mix(base.rgb, lightColor, clamp((base.a - light) * uLightAlpha, 0.0, 1.0)); base.rgb = mix(base.rgb, shadowColor, clamp((base.a - shadow) * uShadowAlpha, 0.0, 1.0)); gl_FragColor = vec4(base.rgb, base.a);",
  BloomFilter: "vec2 radius = vec2(max(uStrengthX, uStrength), max(uStrengthY, uStrength)) / max(uResolution, vec2(1.0)); vec3 blur = vec3(0.0); blur += readInput(uv + vec2(-1.0, -1.0) * radius).rgb * 0.0625; blur += readInput(uv + vec2(0.0, -1.0) * radius).rgb * 0.125; blur += readInput(uv + vec2(1.0, -1.0) * radius).rgb * 0.0625; blur += readInput(uv + vec2(-1.0, 0.0) * radius).rgb * 0.125; blur += readInput(uv).rgb * 0.25; blur += readInput(uv + vec2(1.0, 0.0) * radius).rgb * 0.125; blur += readInput(uv + vec2(-1.0, 1.0) * radius).rgb * 0.0625; blur += readInput(uv + vec2(0.0, 1.0) * radius).rgb * 0.125; blur += readInput(uv + vec2(1.0, 1.0) * radius).rgb * 0.0625; vec3 screened = 1.0 - (1.0 - color.rgb) * (1.0 - blur); color.rgb = mix(color.rgb, screened, 0.85); gl_FragColor = color;",
  BulgePinchFilter: "vec2 center = vec2(uCenterX, uCenterY); vec2 delta = uv - center; float dist = length(delta * uResolution); float pct = clamp(1.0 - dist / max(uRadius, 1.0), 0.0, 1.0); vec2 warped = uv + delta * pct * pct * -uStrength; gl_FragColor = readInput(warped);",
  ColorGradientFilter: "const float PI2 = 6.2831853076; vec2 centered = uv - vec2(0.5); float position = uv.y; if (uType < 0.5) { float a = radians(uAngle - 90.0); vec2 d = vec2(cos(a), sin(a)); position = clamp(dot(centered, d) + 0.5, 0.0, 1.0); } else if (uType < 1.5) { position = clamp(distance(uv, vec2(0.5)) * 2.0, 0.0, 1.0); } else { position = mod(atan(-centered.y, centered.x) + radians(uAngle), PI2) / PI2; } if (uMaxColors > 0.0) { float stepSize = 1.0 / uMaxColors; position = stepSize * (floor(position / stepSize) + 0.5); } float lastOffset = uStop0Offset; if (uStopCount > 1.5) lastOffset = uStop1Offset; if (uStopCount > 2.5) lastOffset = uStop2Offset; if (uStopCount > 3.5) lastOffset = uStop3Offset; if (uStopCount > 4.5) lastOffset = uStop4Offset; if (uStopCount > 5.5) lastOffset = uStop5Offset; if (uStopCount > 6.5) lastOffset = uStop6Offset; if (uStopCount > 7.5) lastOffset = uStop7Offset; if (uStopCount > 8.5) lastOffset = uStop8Offset; if (uStopCount > 9.5) lastOffset = uStop9Offset; if (uStopCount > 10.5) lastOffset = uStop10Offset; if (uStopCount > 11.5) lastOffset = uStop11Offset; if (uStopCount > 12.5) lastOffset = uStop12Offset; if (uStopCount > 13.5) lastOffset = uStop13Offset; if (uStopCount > 14.5) lastOffset = uStop14Offset; if (uStopCount > 15.5) lastOffset = uStop15Offset; if (position < uStop0Offset || position > lastOffset) { gl_FragColor = color; } else { vec4 fromColor = vec4(vec3(uStop0R, uStop0G, uStop0B) * uStop0Alpha, uStop0Alpha); vec4 toColor = vec4(vec3(uStop1R, uStop1G, uStop1B) * uStop1Alpha, uStop1Alpha); float fromOffset = uStop0Offset; float toOffset = uStop1Offset; if (uStopCount > 2.5 && position >= uStop1Offset && position <= uStop2Offset) { fromColor = vec4(vec3(uStop1R, uStop1G, uStop1B) * uStop1Alpha, uStop1Alpha); toColor = vec4(vec3(uStop2R, uStop2G, uStop2B) * uStop2Alpha, uStop2Alpha); fromOffset = uStop1Offset; toOffset = uStop2Offset; } if (uStopCount > 3.5 && position >= uStop2Offset && position <= uStop3Offset) { fromColor = vec4(vec3(uStop2R, uStop2G, uStop2B) * uStop2Alpha, uStop2Alpha); toColor = vec4(vec3(uStop3R, uStop3G, uStop3B) * uStop3Alpha, uStop3Alpha); fromOffset = uStop2Offset; toOffset = uStop3Offset; } if (uStopCount > 4.5 && position >= uStop3Offset && position <= uStop4Offset) { fromColor = vec4(vec3(uStop3R, uStop3G, uStop3B) * uStop3Alpha, uStop3Alpha); toColor = vec4(vec3(uStop4R, uStop4G, uStop4B) * uStop4Alpha, uStop4Alpha); fromOffset = uStop3Offset; toOffset = uStop4Offset; } if (uStopCount > 5.5 && position >= uStop4Offset && position <= uStop5Offset) { fromColor = vec4(vec3(uStop4R, uStop4G, uStop4B) * uStop4Alpha, uStop4Alpha); toColor = vec4(vec3(uStop5R, uStop5G, uStop5B) * uStop5Alpha, uStop5Alpha); fromOffset = uStop4Offset; toOffset = uStop5Offset; } if (uStopCount > 6.5 && position >= uStop5Offset && position <= uStop6Offset) { fromColor = vec4(vec3(uStop5R, uStop5G, uStop5B) * uStop5Alpha, uStop5Alpha); toColor = vec4(vec3(uStop6R, uStop6G, uStop6B) * uStop6Alpha, uStop6Alpha); fromOffset = uStop5Offset; toOffset = uStop6Offset; } if (uStopCount > 7.5 && position >= uStop6Offset && position <= uStop7Offset) { fromColor = vec4(vec3(uStop6R, uStop6G, uStop6B) * uStop6Alpha, uStop6Alpha); toColor = vec4(vec3(uStop7R, uStop7G, uStop7B) * uStop7Alpha, uStop7Alpha); fromOffset = uStop6Offset; toOffset = uStop7Offset; } if (uStopCount > 8.5 && position >= uStop7Offset && position <= uStop8Offset) { fromColor = vec4(vec3(uStop7R, uStop7G, uStop7B) * uStop7Alpha, uStop7Alpha); toColor = vec4(vec3(uStop8R, uStop8G, uStop8B) * uStop8Alpha, uStop8Alpha); fromOffset = uStop7Offset; toOffset = uStop8Offset; } if (uStopCount > 9.5 && position >= uStop8Offset && position <= uStop9Offset) { fromColor = vec4(vec3(uStop8R, uStop8G, uStop8B) * uStop8Alpha, uStop8Alpha); toColor = vec4(vec3(uStop9R, uStop9G, uStop9B) * uStop9Alpha, uStop9Alpha); fromOffset = uStop8Offset; toOffset = uStop9Offset; } if (uStopCount > 10.5 && position >= uStop9Offset && position <= uStop10Offset) { fromColor = vec4(vec3(uStop9R, uStop9G, uStop9B) * uStop9Alpha, uStop9Alpha); toColor = vec4(vec3(uStop10R, uStop10G, uStop10B) * uStop10Alpha, uStop10Alpha); fromOffset = uStop9Offset; toOffset = uStop10Offset; } if (uStopCount > 11.5 && position >= uStop10Offset && position <= uStop11Offset) { fromColor = vec4(vec3(uStop10R, uStop10G, uStop10B) * uStop10Alpha, uStop10Alpha); toColor = vec4(vec3(uStop11R, uStop11G, uStop11B) * uStop11Alpha, uStop11Alpha); fromOffset = uStop10Offset; toOffset = uStop11Offset; } if (uStopCount > 12.5 && position >= uStop11Offset && position <= uStop12Offset) { fromColor = vec4(vec3(uStop11R, uStop11G, uStop11B) * uStop11Alpha, uStop11Alpha); toColor = vec4(vec3(uStop12R, uStop12G, uStop12B) * uStop12Alpha, uStop12Alpha); fromOffset = uStop11Offset; toOffset = uStop12Offset; } if (uStopCount > 13.5 && position >= uStop12Offset && position <= uStop13Offset) { fromColor = vec4(vec3(uStop12R, uStop12G, uStop12B) * uStop12Alpha, uStop12Alpha); toColor = vec4(vec3(uStop13R, uStop13G, uStop13B) * uStop13Alpha, uStop13Alpha); fromOffset = uStop12Offset; toOffset = uStop13Offset; } if (uStopCount > 14.5 && position >= uStop13Offset && position <= uStop14Offset) { fromColor = vec4(vec3(uStop13R, uStop13G, uStop13B) * uStop13Alpha, uStop13Alpha); toColor = vec4(vec3(uStop14R, uStop14G, uStop14B) * uStop14Alpha, uStop14Alpha); fromOffset = uStop13Offset; toOffset = uStop14Offset; } if (uStopCount > 15.5 && position >= uStop14Offset && position <= uStop15Offset) { fromColor = vec4(vec3(uStop14R, uStop14G, uStop14B) * uStop14Alpha, uStop14Alpha); toColor = vec4(vec3(uStop15R, uStop15G, uStop15B) * uStop15Alpha, uStop15Alpha); fromOffset = uStop14Offset; toOffset = uStop15Offset; } float pct = clamp((position - fromOffset) / max(toOffset - fromOffset, 0.0001), 0.0, 1.0); vec4 gradient = mix(fromColor, toColor, pct) * uAlpha * color.a; gl_FragColor = uReplace > 0.5 ? gradient : gradient + color * (1.0 - gradient.a); }",
  ColorMapFilter: "float y = luma(color.rgb); vec3 mapped = vec3(smoothstep(0.0, 1.0, y), y * y, 1.0 - y); color.rgb = mix(color.rgb, mapped, uMix); gl_FragColor = color;",
  ColorOverlayFilter: "color.rgb = mix(color.rgb, vec3(uColorR, uColorG, uColorB), uAlpha); gl_FragColor = color;",
  ColorReplaceFilter: "vec3 orig = vec3(uOriginalColorR, uOriginalColorG, uOriginalColorB); vec3 next = vec3(uNewColorR, uNewColorG, uNewColorB); float m = 1.0 - smoothstep(0.0, max(uEpsilon, 0.0001), distance(color.rgb, orig)); color.rgb = mix(color.rgb, next, m); gl_FragColor = color;",
  ConvolutionFilter: "vec2 p = 1.0 / max(uResolution, vec2(1.0)); vec3 edge = readInput(uv).rgb * 5.0 - readInput(uv + vec2(p.x,0.0)).rgb - readInput(uv - vec2(p.x,0.0)).rgb - readInput(uv + vec2(0.0,p.y)).rgb - readInput(uv - vec2(0.0,p.y)).rgb; color.rgb = mix(color.rgb, edge, uStrength); gl_FragColor = color;",
  CrossHatchFilter: "float lum = length(color.rgb); vec2 frag = uv * uResolution; vec4 hatch = vec4(1.0); if (lum < 1.00 && mod(frag.x + frag.y, 10.0) < 1.0) { hatch = vec4(0.0, 0.0, 0.0, 1.0); } if (lum < 0.75 && mod(frag.x - frag.y, 10.0) < 1.0) { hatch = vec4(0.0, 0.0, 0.0, 1.0); } if (lum < 0.50 && mod(frag.x + frag.y - 5.0, 10.0) < 1.0) { hatch = vec4(0.0, 0.0, 0.0, 1.0); } if (lum < 0.30 && mod(frag.x - frag.y - 5.0, 10.0) < 1.0) { hatch = vec4(0.0, 0.0, 0.0, 1.0); } gl_FragColor = hatch;",
  CRTFilter: "vec2 q = uv * 2.0 - 1.0; vec2 curved = uv + q * dot(q, q) * 0.03 * uCurvature; color = readInput(curved); float scan = 0.85 + 0.15 * sin(uv.y * uResolution.y * max(uLineWidth, 1.0)); float vig = smoothstep(1.2, uVignetting, length(q)); color.rgb *= scan * vig; color.rgb += fract(sin(dot(uv * uTime, vec2(12.9898,78.233))) * 43758.5453) * uNoise * 0.08; gl_FragColor = color;",
  DotFilter: "vec2 p = uv * uResolution / max(uScale, 0.1); float s = sin(uAngle), c = cos(uAngle); p = mat2(c, -s, s, c) * p; float pattern = sin(p.x) * sin(p.y); color.rgb *= 0.8 + 0.2 * pattern; gl_FragColor = color;",
  DropShadowFilter: "vec2 off = vec2(uOffsetX, uOffsetY) / max(uResolution, vec2(1.0)); vec2 blurStep = vec2(max(uBlur, 0.0) + max(uQuality, 0.0) * 0.25) / max(uResolution, vec2(1.0)); float shadow = 0.0; shadow += readInput(uv - off).a * 0.30; shadow += readInput(uv - off + vec2(blurStep.x, 0.0)).a * 0.10; shadow += readInput(uv - off - vec2(blurStep.x, 0.0)).a * 0.10; shadow += readInput(uv - off + vec2(0.0, blurStep.y)).a * 0.10; shadow += readInput(uv - off - vec2(0.0, blurStep.y)).a * 0.10; shadow += readInput(uv - off + blurStep).a * 0.075; shadow += readInput(uv - off - blurStep).a * 0.075; shadow += readInput(uv - off + vec2(blurStep.x, -blurStep.y)).a * 0.075; shadow += readInput(uv - off + vec2(-blurStep.x, blurStep.y)).a * 0.075; vec4 shadowColor = vec4(vec3(uColorR, uColorG, uColorB), shadow * uAlpha); if (uShadowOnly > 0.5) { gl_FragColor = shadowColor; } else { gl_FragColor = shadowColor * (1.0 - color.a) + color; }",
  EmbossFilter: "vec2 p = 1.0 / max(uResolution, vec2(1.0)); vec3 e = readInput(uv - p).rgb - readInput(uv + p).rgb; color.rgb = vec3(0.5) + e * uStrength; gl_FragColor = color;",
  GlitchFilter: "float band = floor(uv.y * max(uSlices, 1.0)); float rnd = fract(sin(band * 12.9898 + uSeed + uTime * 0.01) * 43758.5453); vec2 dir = vec2(cos(radians(uDirection)), sin(radians(uDirection))); vec2 guv = uv + dir * (rnd - 0.5) * uOffset / max(uResolution, vec2(1.0)); gl_FragColor = readInput(guv);",
  GlowFilter: "float currentInside = step(0.0, uv.x) * step(0.0, uv.y) * step(uv.x, 1.0) * step(uv.y, 1.0); color *= currentInside; float totalAlpha = 0.0; float sampleCount = 0.0; vec2 radius = vec2(max(uDistance, 0.0)) / max(uResolution, vec2(1.0)); for (int x = -4; x <= 4; x++) { for (int y = -4; y <= 4; y++) { vec2 dir = vec2(float(x), float(y)); float dist = length(dir); if (dist > 0.0 && dist <= 4.0) { vec2 sampleUv = uv + normalize(dir) * radius * (dist / 4.0); float sampleInside = step(0.0, sampleUv.x) * step(0.0, sampleUv.y) * step(sampleUv.x, 1.0) * step(sampleUv.y, 1.0); float weight = 1.0 - dist / 4.0; totalAlpha += readInput(sampleUv).a * sampleInside * weight; sampleCount += weight; } }} float alphaRatio = sampleCount > 0.0 ? clamp(totalAlpha / sampleCount, 0.0, 1.0) : 0.0; vec4 glowColor = vec4(vec3(uColorR, uColorG, uColorB), uAlpha); float innerGlowAlpha = (1.0 - alphaRatio) * uInnerStrength * color.a * uAlpha; float innerGlowStrength = min(1.0, innerGlowAlpha); vec4 innerColor = mix(color, glowColor, innerGlowStrength); float outerGlowAlpha = alphaRatio * uOuterStrength * (1.0 - color.a) * uAlpha; float outerGlowStrength = min(1.0 - innerColor.a, outerGlowAlpha); vec4 outerGlowColor = outerGlowStrength * glowColor; if (uKnockout > 0.5) { float resultAlpha = clamp(outerGlowAlpha + innerGlowAlpha, 0.0, 1.0); gl_FragColor = vec4(glowColor.rgb * resultAlpha, resultAlpha); } else { gl_FragColor = innerColor + outerGlowColor; }",
  GodrayFilter: "vec2 d = vec2(cos(radians(uAngle)), sin(radians(uAngle))); float rays = pow(max(0.0, sin(dot(uv, d) * 40.0 + uTime * 0.03)), max(uLacunarity, 0.1)); color.rgb += rays * uGain * color.a; gl_FragColor = color;",
  GrayscaleFilter: "color.rgb = mix(color.rgb, vec3(luma(color.rgb)), uAmount); gl_FragColor = color;",
  HslAdjustmentFilter: "float a = radians(uHue); mat3 rot = mat3(0.213 + cos(a)*0.787 - sin(a)*0.213, 0.715 - cos(a)*0.715 - sin(a)*0.715, 0.072 - cos(a)*0.072 + sin(a)*0.928, 0.213 - cos(a)*0.213 + sin(a)*0.143, 0.715 + cos(a)*0.285 + sin(a)*0.140, 0.072 - cos(a)*0.072 - sin(a)*0.283, 0.213 - cos(a)*0.213 - sin(a)*0.787, 0.715 - cos(a)*0.715 + sin(a)*0.715, 0.072 + cos(a)*0.928 + sin(a)*0.072); color.rgb = rot * color.rgb; color.rgb = mix(vec3(luma(color.rgb)), color.rgb, uSaturation) + uLightness; gl_FragColor = color;",
  KawaseBlurFilter: "float quality = clamp(floor(uQuality + 0.5), 1.0, 12.0); vec2 pixelSize = max(vec2(uPixelSizeX, uPixelSizeY), vec2(0.0)); vec4 sum = readInput(uv) * 0.5; float total = 0.5; for (int i = 0; i < 12; i++) { float fi = float(i); if (fi < quality && uStrength > 0.0) { float kernel = ((quality - fi) / quality) * uStrength + 0.5; vec2 offset = kernel * pixelSize / max(uResolution, vec2(1.0)); vec2 uv1 = uv + offset; vec2 uv2 = uv - offset; vec2 uv3 = uv + vec2(offset.x, -offset.y); vec2 uv4 = uv + vec2(-offset.x, offset.y); if (uClamp > 0.5) { uv1 = clamp(uv1, vec2(0.0), vec2(1.0)); uv2 = clamp(uv2, vec2(0.0), vec2(1.0)); uv3 = clamp(uv3, vec2(0.0), vec2(1.0)); uv4 = clamp(uv4, vec2(0.0), vec2(1.0)); } float weight = 1.0 - fi / max(quality, 1.0); sum += (readInput(uv1) + readInput(uv2) + readInput(uv3) + readInput(uv4)) * (0.25 * weight); total += weight; }} gl_FragColor = sum / max(total, 0.0001);",
  MotionBlurFilter: "vec2 v = vec2(uVelocityX, uVelocityY) / max(uResolution, vec2(1.0)); vec4 sum = vec4(0.0); for (int i = -4; i <= 4; i++) { sum += readInput(uv + v * (float(i) / 4.0 + uOffset)); } gl_FragColor = sum / 9.0;",
  MultiColorReplaceFilter: "vec3 orig = vec3(uOriginalColorR, uOriginalColorG, uOriginalColorB); vec3 next = vec3(uTargetColorR, uTargetColorG, uTargetColorB); float m = 1.0 - smoothstep(0.0, max(uEpsilon, 0.0001), distance(color.rgb, orig)); color.rgb = mix(color.rgb, next, m); gl_FragColor = color;",
  OldFilmFilter: "const float SQRT_2 = 1.414213; vec3 sepiaRgb = vec3(112.0 / 255.0, 66.0 / 255.0, 20.0 / 255.0); float randomSeed = max(uSeed, 0.0001); if (uSepia > 0.0) { float gray = (color.r + color.g + color.b) / 3.0; vec3 grayscale = vec3(gray); vec3 overlay = vec3(grayscale.r <= 0.5 ? 2.0 * sepiaRgb.r * grayscale.r : 1.0 - 2.0 * (1.0 - sepiaRgb.r) * (1.0 - grayscale.r), grayscale.g <= 0.5 ? 2.0 * sepiaRgb.g * grayscale.g : 1.0 - 2.0 * (1.0 - sepiaRgb.g) * (1.0 - grayscale.g), grayscale.b <= 0.5 ? 2.0 * sepiaRgb.b * grayscale.b : 1.0 - 2.0 * (1.0 - sepiaRgb.b) * (1.0 - grayscale.b)); color.rgb = grayscale + uSepia * (overlay - grayscale); } if (uVignetting > 0.0) { float outter = SQRT_2 - uVignetting * SQRT_2; vec2 dir = vec2(0.5) - uv; dir.y *= uResolution.y / max(uResolution.x, 1.0); float darker = clamp((outter - length(dir) * SQRT_2) / (0.00001 + max(uVignettingBlur, 0.0) * SQRT_2), 0.0, 1.0); color.rgb *= darker + (1.0 - darker) * (1.0 - uVignettingAlpha); } if (uScratchDensity > randomSeed && uScratch != 0.0) { float phase = randomSeed * 256.0; float s = mod(floor(phase), 2.0); float dist = 1.0 / max(uScratchDensity, 0.0001); float d = distance(uv, vec2(randomSeed * dist, abs(s - randomSeed * dist))); if (d < randomSeed * 0.6 + 0.4) { float period = uScratchDensity * 10.0; float xx = uv.x * period + phase; float aa = abs(mod(xx, 0.5) * 4.0); float bb = mod(floor(xx / 0.5), 2.0); float yy = (1.0 - bb) * aa + bb * (2.0 - aa); float kk = 2.0 * period; float dw = uScratchWidth / max(uResolution.x, 1.0) * (0.75 + randomSeed); float dh = dw * kk; float tine = yy - (2.0 - dh); if (tine > 0.0) { float scratchSign = sign(uScratch); tine = s * tine / max(period, 0.0001) + uScratch + 0.1; tine = clamp(tine + 1.0, 0.5 + scratchSign * 0.5, 1.5 + scratchSign * 0.5); color.rgb *= tine; } }} if (uNoise > 0.0 && uNoiseSize > 0.0) { vec2 pixelCoord = uv * uResolution; pixelCoord = floor(pixelCoord / uNoiseSize); float filmNoise = fract(sin(dot(pixelCoord * uNoiseSize * randomSeed, vec2(12.9898, 78.233))) * 43758.5453) - 0.5; color.rgb += filmNoise * uNoise; } gl_FragColor = color;",
  OutlineFilter: "float currentInside = step(0.0, uv.x) * step(0.0, uv.y) * step(uv.x, 1.0) * step(uv.y, 1.0); color *= currentInside; float edge = 0.0; vec2 radius = vec2(max(uThickness, 0.0)) / max(uResolution, vec2(1.0)); for (int x=-4; x<=4; x++) { for (int y=-4; y<=4; y++) { vec2 dir = vec2(float(x), float(y)); float dist = length(dir); if (dist > 0.0 && dist <= 4.0) { vec2 sampleUv = uv + normalize(dir) * radius * (dist / 4.0); float sampleInside = step(0.0, sampleUv.x) * step(0.0, sampleUv.y) * step(sampleUv.x, 1.0) * step(sampleUv.y, 1.0); edge = max(edge, readInput(sampleUv).a * sampleInside); } }} vec4 outline = vec4(vec3(uColorR, uColorG, uColorB), edge * uAlpha); gl_FragColor = color + outline * (1.0 - color.a);",
  PixelateFilter: "vec2 size = max(vec2(uSizeX, uSizeY), vec2(1.0)); vec2 p = size / max(uResolution, vec2(1.0)); gl_FragColor = readInput((floor(uv / p) + 0.5) * p);",
  RadialBlurFilter: "vec2 c = vec2(uCenterX, uCenterY); vec4 sum = vec4(0.0); for (int i=-4; i<=4; i++) { float t = float(i) / 4.0 * radians(uAngle) * 0.02; vec2 d = uv - c; vec2 r = vec2(d.x*cos(t)-d.y*sin(t), d.x*sin(t)+d.y*cos(t)); sum += readInput(c + r); } gl_FragColor = sum / 9.0;",
  ReflectionFilter: "vec2 safeResolution = max(uResolution, vec2(1.0)); float visualY = 1.0 - uv.y; if (visualY < uBoundary) { gl_FragColor = color; return; } float k = (visualY - uBoundary) / max(1.0 - uBoundary, 0.0001); float reflectedVisualY = uBoundary + uBoundary - visualY; float y = uMirror > 0.5 ? 1.0 - reflectedVisualY : uv.y; float amplitude = mix(uAmplitudeStart, uAmplitudeEnd, k) / safeResolution.x; float waveLength = mix(uWaveLengthStart, uWaveLengthEnd, k) / safeResolution.y; float alpha = mix(uAlphaStart, uAlphaEnd, k); float x = uv.x + cos(y * 6.28318530718 / max(waveLength, 0.0001) - uTime) * amplitude; vec2 reflectionUv = clamp(vec2(x, y), vec2(0.0), vec2(1.0)); gl_FragColor = readInput(reflectionUv) * alpha;",
  RGBSplitFilter: "vec2 r = vec2(uRedX, uRedY) / max(uResolution, vec2(1.0)); vec2 g = vec2(uGreenX, uGreenY) / max(uResolution, vec2(1.0)); vec2 b = vec2(uBlueX, uBlueY) / max(uResolution, vec2(1.0)); gl_FragColor = vec4(readInput(uv+r).r, readInput(uv+g).g, readInput(uv+b).b, color.a);",
  ShockwaveFilter: "const float PI = 3.14159; vec2 safeResolution = max(uResolution, vec2(1.0)); vec2 centerUv = vec2(uCenterX, uCenterY); float halfWavelength = uWavelength * 0.5 / safeResolution.x; float maxRadius = uRadius / safeResolution.x; float currentRadius = uTime * uSpeed / safeResolution.x; float fade = 1.0; if (maxRadius > 0.0) { if (currentRadius > maxRadius) { gl_FragColor = color; return; } fade = 1.0 - pow(currentRadius / maxRadius, 2.0); } vec2 dir = uv - centerUv; dir.y *= safeResolution.y / safeResolution.x; float dist = length(dir); if (dist <= 0.0 || dist < currentRadius - halfWavelength || dist > currentRadius + halfWavelength) { gl_FragColor = color; return; } vec2 diffUv = normalize(dir); float diff = (dist - currentRadius) / max(halfWavelength, 0.00001); float p = 1.0 - pow(abs(diff), 2.0); float powDiff = 1.25 * sin(diff * PI) * p * (uAmplitude * fade); vec2 coord = uv + diffUv * powDiff / safeResolution; vec2 clampedCoord = clamp(coord, vec2(0.0), vec2(1.0)); vec4 waveColor = readInput(clampedCoord); if (coord != clampedCoord) { waveColor *= max(0.0, 1.0 - length(coord - clampedCoord)); } waveColor.rgb *= 1.0 + (uBrightness - 1.0) * p * fade; gl_FragColor = waveColor;",
  SimpleLightmapFilter: "vec2 q = uv - 0.5; float light = smoothstep(0.8, 0.0, length(q)); color.rgb *= mix(vec3(1.0), vec3(uColorR, uColorG, uColorB) * (1.0 + light), uAlpha); gl_FragColor = color;",
  SimplexNoiseFilter: "float n = fract(sin(dot(floor(uv * uResolution * max(uStep, 0.01)), vec2(12.9898,78.233))) * 43758.5453); color.rgb += (n - 0.5) * uStrength; gl_FragColor = color;",
  TiltShiftFilter: "float mask = smoothstep(uStartY, uEndY, uv.y); mask = abs(mask - 0.5) * 2.0; vec2 o = vec2(uBlur * mask) / max(uResolution, vec2(1.0)); gl_FragColor = (readInput(uv) + readInput(uv + o) + readInput(uv - o)) / 3.0;",
  TwistFilter: "vec2 c = vec2(uOffsetX, uOffsetY); vec2 d = uv - c; float dist = length(d * uResolution); float pct = clamp(1.0 - dist / max(uRadius, 1.0), 0.0, 1.0); float a = pct * pct * uAngle; vec2 r = vec2(d.x*cos(a)-d.y*sin(a), d.x*sin(a)+d.y*cos(a)); gl_FragColor = readInput(c + r);",
  ZoomBlurFilter: "vec2 c = vec2(uCenterX, uCenterY); vec4 sum = vec4(0.0); for (int i=0; i<9; i++) { float t = float(i) / 8.0; sum += readInput(mix(uv, c, t * uStrength)); } gl_FragColor = sum / 9.0;",
  AlphaFilter: "color.a *= uAlpha; gl_FragColor = color;",
  BlurFilter: "vec2 o = vec2(uStrength) / max(uResolution, vec2(1.0)); gl_FragColor = (readInput(uv) + readInput(uv+vec2(o.x,0.0)) + readInput(uv-vec2(o.x,0.0)) + readInput(uv+vec2(0.0,o.y)) + readInput(uv-vec2(0.0,o.y))) / 5.0;",
  ColorMatrixFilter: "float gray = luma(color.rgb); color.rgb = mix(vec3(gray), color.rgb, uSaturation); color.rgb = ((color.rgb - 0.5) * uContrast + 0.5) * uBrightness; gl_FragColor = color;",
  DisplacementFilter: "vec2 map = texture2D(uDisplacementSampler, uv).rg - vec2(0.5); vec2 offset = map * vec2(uScaleX, uScaleY) / max(uResolution, vec2(1.0)); gl_FragColor = readInput(uv + offset);",
  NoiseFilter: "float n = fract(sin(dot(uv * uResolution + uSeed + uTime, vec2(12.9898,78.233))) * 43758.5453); color.rgb += (n - 0.5) * uNoise; gl_FragColor = color;",
} as const;

const FILTER_UNIFORMS = {
  AdjustmentFilter: "uniform float uGamma;\nuniform float uContrast;\nuniform float uSaturation;\nuniform float uBrightness;\nuniform float uRed;\nuniform float uGreen;\nuniform float uBlue;\nuniform float uAlpha;",
  AdvancedBloomFilter: "uniform float uThreshold;\nuniform float uBloomScale;\nuniform float uBrightness;\nuniform float uBlur;\nuniform float uQuality;",
  AsciiFilter: "uniform float uSize;",
  BackdropBlurFilter: "uniform float uStrength;",
  BevelFilter: "uniform float uRotation;\nuniform float uThickness;\nuniform float uLightColorR;\nuniform float uLightColorG;\nuniform float uLightColorB;\nuniform float uLightAlpha;\nuniform float uShadowColorR;\nuniform float uShadowColorG;\nuniform float uShadowColorB;\nuniform float uShadowAlpha;",
  BloomFilter: "uniform float uStrength;\nuniform float uStrengthX;\nuniform float uStrengthY;\nuniform float uQuality;\nuniform float uKernelSize;",
  BulgePinchFilter: "uniform float uRadius;\nuniform float uStrength;\nuniform float uCenterX;\nuniform float uCenterY;",
  ColorGradientFilter: "uniform float uType;\nuniform float uAlpha;\nuniform float uAngle;\nuniform float uMaxColors;\nuniform float uReplace;\nuniform float uStopCount;\nuniform float uStop0R;\nuniform float uStop0G;\nuniform float uStop0B;\nuniform float uStop0Offset;\nuniform float uStop0Alpha;\nuniform float uStop1R;\nuniform float uStop1G;\nuniform float uStop1B;\nuniform float uStop1Offset;\nuniform float uStop1Alpha;\nuniform float uStop2R;\nuniform float uStop2G;\nuniform float uStop2B;\nuniform float uStop2Offset;\nuniform float uStop2Alpha;\nuniform float uStop3R;\nuniform float uStop3G;\nuniform float uStop3B;\nuniform float uStop3Offset;\nuniform float uStop3Alpha;\nuniform float uStop4R;\nuniform float uStop4G;\nuniform float uStop4B;\nuniform float uStop4Offset;\nuniform float uStop4Alpha;\nuniform float uStop5R;\nuniform float uStop5G;\nuniform float uStop5B;\nuniform float uStop5Offset;\nuniform float uStop5Alpha;\nuniform float uStop6R;\nuniform float uStop6G;\nuniform float uStop6B;\nuniform float uStop6Offset;\nuniform float uStop6Alpha;\nuniform float uStop7R;\nuniform float uStop7G;\nuniform float uStop7B;\nuniform float uStop7Offset;\nuniform float uStop7Alpha;\nuniform float uStop8R;\nuniform float uStop8G;\nuniform float uStop8B;\nuniform float uStop8Offset;\nuniform float uStop8Alpha;\nuniform float uStop9R;\nuniform float uStop9G;\nuniform float uStop9B;\nuniform float uStop9Offset;\nuniform float uStop9Alpha;\nuniform float uStop10R;\nuniform float uStop10G;\nuniform float uStop10B;\nuniform float uStop10Offset;\nuniform float uStop10Alpha;\nuniform float uStop11R;\nuniform float uStop11G;\nuniform float uStop11B;\nuniform float uStop11Offset;\nuniform float uStop11Alpha;\nuniform float uStop12R;\nuniform float uStop12G;\nuniform float uStop12B;\nuniform float uStop12Offset;\nuniform float uStop12Alpha;\nuniform float uStop13R;\nuniform float uStop13G;\nuniform float uStop13B;\nuniform float uStop13Offset;\nuniform float uStop13Alpha;\nuniform float uStop14R;\nuniform float uStop14G;\nuniform float uStop14B;\nuniform float uStop14Offset;\nuniform float uStop14Alpha;\nuniform float uStop15R;\nuniform float uStop15G;\nuniform float uStop15B;\nuniform float uStop15Offset;\nuniform float uStop15Alpha;",
  ColorMapFilter: "uniform float uMix;\nuniform float uNearest;",
  ColorOverlayFilter: "uniform float uColorR;\nuniform float uColorG;\nuniform float uColorB;\nuniform float uAlpha;",
  ColorReplaceFilter: "uniform float uOriginalColorR;\nuniform float uOriginalColorG;\nuniform float uOriginalColorB;\nuniform float uNewColorR;\nuniform float uNewColorG;\nuniform float uNewColorB;\nuniform float uEpsilon;",
  ConvolutionFilter: "uniform float uStrength;",
  CrossHatchFilter: "",
  CRTFilter: "uniform float uCurvature;\nuniform float uLineWidth;\nuniform float uNoise;\nuniform float uVignetting;",
  DotFilter: "uniform float uScale;\nuniform float uAngle;",
  DropShadowFilter: "uniform float uOffsetX;\nuniform float uOffsetY;\nuniform float uAlpha;\nuniform float uColorR;\nuniform float uColorG;\nuniform float uColorB;\nuniform float uBlur;\nuniform float uQuality;\nuniform float uShadowOnly;",
  EmbossFilter: "uniform float uStrength;",
  GlitchFilter: "uniform float uSlices;\nuniform float uOffset;\nuniform float uDirection;\nuniform float uFillMode;\nuniform float uSeed;",
  GlowFilter: "uniform float uDistance;\nuniform float uOuterStrength;\nuniform float uInnerStrength;\nuniform float uColorR;\nuniform float uColorG;\nuniform float uColorB;\nuniform float uAlpha;\nuniform float uQuality;\nuniform float uKnockout;",
  GodrayFilter: "uniform float uGain;\nuniform float uLacunarity;\nuniform float uParallel;\nuniform float uAngle;",
  GrayscaleFilter: "uniform float uAmount;",
  HslAdjustmentFilter: "uniform float uHue;\nuniform float uSaturation;\nuniform float uLightness;\nuniform float uColorizeR;\nuniform float uColorizeG;\nuniform float uColorizeB;",
  KawaseBlurFilter: "uniform float uStrength;\nuniform float uQuality;\nuniform float uPixelSizeX;\nuniform float uPixelSizeY;\nuniform float uClamp;",
  MotionBlurFilter: "uniform float uVelocityX;\nuniform float uVelocityY;\nuniform float uKernelSize;\nuniform float uOffset;",
  MultiColorReplaceFilter: "uniform float uEpsilon;\nuniform float uOriginalColorR;\nuniform float uOriginalColorG;\nuniform float uOriginalColorB;\nuniform float uTargetColorR;\nuniform float uTargetColorG;\nuniform float uTargetColorB;",
  OldFilmFilter: "uniform float uSepia;\nuniform float uNoise;\nuniform float uNoiseSize;\nuniform float uScratch;\nuniform float uScratchDensity;\nuniform float uScratchWidth;\nuniform float uVignetting;\nuniform float uVignettingAlpha;\nuniform float uVignettingBlur;\nuniform float uSeed;",
  OutlineFilter: "uniform float uThickness;\nuniform float uColorR;\nuniform float uColorG;\nuniform float uColorB;\nuniform float uAlpha;",
  PixelateFilter: "uniform float uSizeX;\nuniform float uSizeY;",
  RadialBlurFilter: "uniform float uAngle;\nuniform float uRadius;\nuniform float uCenterX;\nuniform float uCenterY;\nuniform float uKernelSize;",
  ReflectionFilter: "uniform float uAnimating;\nuniform float uMirror;\nuniform float uBoundary;\nuniform float uAmplitudeStart;\nuniform float uAmplitudeEnd;\nuniform float uWaveLengthStart;\nuniform float uWaveLengthEnd;\nuniform float uAlphaStart;\nuniform float uAlphaEnd;",
  RGBSplitFilter: "uniform float uRedX;\nuniform float uRedY;\nuniform float uGreenX;\nuniform float uGreenY;\nuniform float uBlueX;\nuniform float uBlueY;",
  ShockwaveFilter: "uniform float uAnimating;\nuniform float uCenterX;\nuniform float uCenterY;\nuniform float uSpeed;\nuniform float uAmplitude;\nuniform float uWavelength;\nuniform float uBrightness;\nuniform float uRadius;",
  SimpleLightmapFilter: "uniform float uColorR;\nuniform float uColorG;\nuniform float uColorB;\nuniform float uAlpha;",
  SimplexNoiseFilter: "uniform float uStrength;\nuniform float uStep;",
  TiltShiftFilter: "uniform float uBlur;\nuniform float uGradientBlur;\nuniform float uStartX;\nuniform float uStartY;\nuniform float uEndX;\nuniform float uEndY;",
  TwistFilter: "uniform float uRadius;\nuniform float uAngle;\nuniform float uOffsetX;\nuniform float uOffsetY;",
  ZoomBlurFilter: "uniform float uStrength;\nuniform float uCenterX;\nuniform float uCenterY;\nuniform float uInnerRadius;\nuniform float uRadius;",
  AlphaFilter: "uniform float uAlpha;",
  BlurFilter: "uniform float uStrength;",
  ColorMatrixFilter: "uniform float uSaturation;\nuniform float uBrightness;\nuniform float uContrast;",
  DisplacementFilter: "uniform float uScaleX;\nuniform float uScaleY;\nuniform sampler2D uDisplacementSampler;",
  NoiseFilter: "uniform float uNoise;\nuniform float uSeed;",
} as const;

export const FILTER_METADATA = ([
  {
    id: 'AdjustmentFilter',
    displayName: 'Adjustment',
    source: 'pixi-source',
    fishOnly: false,
    defaults: {"gamma":1,"contrast":1,"saturation":1,"brightness":1,"red":1,"green":1,"blue":1,"alpha":1},
    controls: [{"key":"gamma","type":"number","min":0,"max":3},{"key":"contrast","type":"number","min":0,"max":3},{"key":"saturation","type":"number","min":0,"max":3},{"key":"brightness","type":"number","min":0,"max":3},{"key":"red","type":"number","min":0,"max":3},{"key":"green","type":"number","min":0,"max":3},{"key":"blue","type":"number","min":0,"max":3},{"key":"alpha","type":"number","min":0,"max":1}]
  },
  {
    id: 'AdvancedBloomFilter',
    displayName: 'Advanced Bloom',
    source: 'pixi-source',
    fishOnly: false,
    defaults: {"threshold":0.5,"bloomScale":1,"brightness":1,"blur":8,"quality":4},
    controls: [{"key":"threshold","type":"number","min":0,"max":1},{"key":"bloomScale","type":"number","min":0,"max":3},{"key":"brightness","type":"number","min":0,"max":3},{"key":"blur","type":"number","min":0,"max":30}]
  },
  {
    id: 'AsciiFilter',
    displayName: 'Ascii',
    source: 'pixi-source',
    fishOnly: false,
    defaults: {"size":8},
    controls: [{"key":"size","type":"number","min":2,"max":32}]
  },
  {
    id: 'BackdropBlurFilter',
    displayName: 'Backdrop Blur',
    source: 'pixi-source',
    fishOnly: false,
    defaults: {"strength":8},
    controls: [{"key":"strength","type":"number","min":0,"max":30}]
  },
  {
    id: 'BevelFilter',
    displayName: 'Bevel',
    source: 'pixi-source',
    fishOnly: true,
    defaults: {"rotation":45,"thickness":2,"lightColor":16777215,"lightAlpha":0.7,"shadowColor":0,"shadowAlpha":0.7},
    controls: [{"key":"rotation","type":"number","min":0,"max":360},{"key":"thickness","type":"number","min":0,"max":10},{"key":"lightColor","type":"color"},{"key":"lightAlpha","type":"number","min":0,"max":1},{"key":"shadowColor","type":"color"},{"key":"shadowAlpha","type":"number","min":0,"max":1}]
  },
  {
    id: 'BloomFilter',
    displayName: 'Bloom',
    source: 'pixi-source',
    fishOnly: false,
    defaults: {"strength":2,"strengthX":2,"strengthY":2,"quality":4,"resolution":1,"kernelSize":5},
    controls: [{"key":"strength","type":"number","min":0,"max":20},{"key":"strengthX","type":"number","min":0,"max":20},{"key":"strengthY","type":"number","min":0,"max":20}]
  },
  {
    id: 'BulgePinchFilter',
    displayName: 'Bulge Pinch',
    source: 'pixi-source',
    fishOnly: false,
    defaults: {"radius":100,"strength":1,"centerX":0.5,"centerY":0.5},
    controls: [{"key":"radius","type":"number","min":1,"max":500},{"key":"strength","type":"number","min":-2,"max":2},{"key":"centerX","type":"number","min":0,"max":1},{"key":"centerY","type":"number","min":0,"max":1}]
  },
  {
    id: 'ColorGradientFilter',
    displayName: 'Color Gradient',
    source: 'pixi-source',
    fishOnly: true,
    defaults: {"type":0,"alpha":1,"angle":90,"maxColors":0,"replace":false,"stops":[{"offset":0,"color":16711680,"alpha":1},{"offset":1,"color":255,"alpha":1}]},
    controls: []
  },
  {
    id: 'ColorMapFilter',
    displayName: 'Color Map',
    source: 'pixi-source',
    fishOnly: false,
    defaults: {"mix":1,"nearest":false},
    controls: [{"key":"mix","type":"number","min":0,"max":1},{"key":"nearest","type":"boolean"}]
  },
  {
    id: 'ColorOverlayFilter',
    displayName: 'Color Overlay',
    source: 'pixi-source',
    fishOnly: true,
    defaults: {"color":16711680,"alpha":1},
    controls: [{"key":"color","type":"color"},{"key":"alpha","type":"number","min":0,"max":1}]
  },
  {
    id: 'ColorReplaceFilter',
    displayName: 'Color Replace',
    source: 'pixi-source',
    fishOnly: false,
    defaults: {"originalColor":16711680,"newColor":65280,"epsilon":0.4},
    controls: [{"key":"originalColor","type":"color"},{"key":"newColor","type":"color"},{"key":"epsilon","type":"number","min":0,"max":1}]
  },
  {
    id: 'ConvolutionFilter',
    displayName: 'Convolution',
    source: 'pixi-source',
    fishOnly: false,
    defaults: {"strength":1},
    controls: [{"key":"strength","type":"number","min":-3,"max":3}]
  },
  {
    id: 'CrossHatchFilter',
    displayName: 'Cross Hatch',
    source: 'pixi-source',
    fishOnly: false,
    defaults: {},
    controls: []
  },
  {
    id: 'CRTFilter',
    displayName: 'Crt',
    source: 'pixi-source',
    fishOnly: false,
    defaults: {"curvature":1,"lineWidth":1,"noise":0.2,"vignetting":0.3},
    controls: [{"key":"curvature","type":"number","min":0,"max":3},{"key":"lineWidth","type":"number","min":0,"max":10},{"key":"noise","type":"number","min":0,"max":1},{"key":"vignetting","type":"number","min":0,"max":1}]
  },
  {
    id: 'DotFilter',
    displayName: 'Dot',
    source: 'pixi-source',
    fishOnly: false,
    defaults: {"scale":1,"angle":5},
    controls: [{"key":"scale","type":"number","min":0.1,"max":4},{"key":"angle","type":"number","min":0,"max":10}]
  },
  {
    id: 'DropShadowFilter',
    displayName: 'Drop Shadow',
    source: 'pixi-source',
    fishOnly: true,
    defaults: {"offsetX":4,"offsetY":4,"alpha":0.5,"color":0,"blur":2,"quality":3,"shadowOnly":false},
    controls: [{"key":"blur","type":"number","min":0,"max":20},{"key":"quality","type":"number","min":0,"max":20},{"key":"alpha","type":"number","min":0,"max":1},{"key":"offsetX","type":"number","min":-50,"max":50},{"key":"offsetY","type":"number","min":-50,"max":50},{"key":"color","type":"color"},{"key":"shadowOnly","type":"boolean"}]
  },
  {
    id: 'EmbossFilter',
    displayName: 'Emboss',
    source: 'pixi-source',
    fishOnly: false,
    defaults: {"strength":5},
    controls: [{"key":"strength","type":"number","min":0,"max":20}]
  },
  {
    id: 'GlitchFilter',
    displayName: 'Glitch',
    source: 'pixi-source',
    fishOnly: false,
    defaults: {"slices":5,"offset":10,"direction":0,"fillMode":0,"seed":0},
    controls: [{"key":"slices","type":"number","min":1,"max":20},{"key":"offset","type":"number","min":0,"max":50},{"key":"direction","type":"number","min":0,"max":360},{"key":"seed","type":"number","min":0,"max":20}]
  },
  {
    id: 'GlowFilter',
    displayName: 'Glow',
    source: 'pixi-source',
    fishOnly: true,
    defaults: {"distance":15,"outerStrength":2,"innerStrength":0,"color":16777215,"alpha":1,"quality":0.2,"knockout":false},
    controls: [{"key":"distance","type":"number","min":0,"max":20},{"key":"innerStrength","type":"number","min":0,"max":20},{"key":"outerStrength","type":"number","min":0,"max":20},{"key":"color","type":"color"},{"key":"quality","type":"number","min":0,"max":1},{"key":"alpha","type":"number","min":0,"max":1},{"key":"knockout","type":"boolean"}]
  },
  {
    id: 'GodrayFilter',
    displayName: 'Godray',
    source: 'pixi-source',
    fishOnly: false,
    defaults: {"gain":0.5,"lacunarity":2.5,"parallel":true,"time":0,"angle":30},
    controls: [{"key":"gain","type":"number","min":0,"max":2},{"key":"lacunarity","type":"number","min":0,"max":5},{"key":"parallel","type":"boolean"},{"key":"angle","type":"number","min":0,"max":360}]
  },
  {
    id: 'GrayscaleFilter',
    displayName: 'Grayscale',
    source: 'pixi-source',
    fishOnly: false,
    defaults: {"amount":1},
    controls: [{"key":"amount","type":"number","min":0,"max":1}]
  },
  {
    id: 'HslAdjustmentFilter',
    displayName: 'Hsl Adjustment',
    source: 'pixi-source',
    fishOnly: false,
    defaults: {"hue":0,"saturation":1,"lightness":0,"colorize":false},
    controls: [{"key":"hue","type":"number","min":-180,"max":180},{"key":"saturation","type":"number","min":0,"max":3},{"key":"lightness","type":"number","min":-1,"max":1},{"key":"colorize","type":"boolean"}]
  },
  {
    id: 'KawaseBlurFilter',
    displayName: 'Kawase Blur',
    source: 'pixi-source',
    fishOnly: false,
    defaults: {"strength":4,"quality":3,"pixelSizeX":1,"pixelSizeY":1,"clamp":true},
    controls: [{"key":"strength","type":"number","min":0,"max":20},{"key":"quality","type":"number","min":1,"max":20},{"key":"pixelSizeX","type":"number","min":0,"max":10},{"key":"pixelSizeY","type":"number","min":0,"max":10},{"key":"clamp","type":"boolean"}]
  },
  {
    id: 'MotionBlurFilter',
    displayName: 'Motion Blur',
    source: 'pixi-source',
    fishOnly: false,
    defaults: {"velocityX":12,"velocityY":0,"kernelSize":5,"offset":0},
    controls: [{"key":"velocityX","type":"number","min":-50,"max":50},{"key":"velocityY","type":"number","min":-50,"max":50},{"key":"kernelSize","type":"number","min":1,"max":15},{"key":"offset","type":"number","min":-1,"max":1}]
  },
  {
    id: 'MultiColorReplaceFilter',
    displayName: 'Multi Color Replace',
    source: 'pixi-source',
    fishOnly: false,
    defaults: {"epsilon":0.2,"originalColor":16711680,"targetColor":65280},
    controls: [{"key":"epsilon","type":"number","min":0,"max":1},{"key":"originalColor","type":"color"},{"key":"targetColor","type":"color"}]
  },
  {
    id: 'OldFilmFilter',
    displayName: 'Old Film',
    source: 'pixi-source',
    fishOnly: false,
    defaults: {"sepia":0.3,"noise":0.3,"noiseSize":1,"scratch":0.5,"scratchDensity":0.3,"scratchWidth":1,"vignetting":0.3,"vignettingAlpha":1,"vignettingBlur":0.3,"seed":0},
    controls: [{"key":"sepia","type":"number","min":0,"max":1},{"key":"noise","type":"number","min":0,"max":1},{"key":"noiseSize","type":"number","min":1,"max":10},{"key":"scratch","type":"number","min":-1,"max":1},{"key":"scratchDensity","type":"number","min":0,"max":1},{"key":"scratchWidth","type":"number","min":1,"max":20},{"key":"vignetting","type":"number","min":0,"max":1},{"key":"vignettingAlpha","type":"number","min":0,"max":1},{"key":"vignettingBlur","type":"number","min":0,"max":1}]
  },
  {
    id: 'OutlineFilter',
    displayName: 'Outline',
    source: 'pixi-source',
    fishOnly: true,
    defaults: {"thickness":3,"color":16777215,"alpha":1},
    controls: [{"key":"thickness","type":"number","min":0,"max":20},{"key":"color","type":"color"},{"key":"alpha","type":"number","min":0,"max":1}]
  },
  {
    id: 'PixelateFilter',
    displayName: 'Pixelate',
    source: 'pixi-source',
    fishOnly: false,
    defaults: {"sizeX":10,"sizeY":10},
    controls: [{"key":"sizeX","type":"number","min":1,"max":80},{"key":"sizeY","type":"number","min":1,"max":80}]
  },
  {
    id: 'RadialBlurFilter',
    displayName: 'Radial Blur',
    source: 'pixi-source',
    fishOnly: false,
    defaults: {"angle":20,"radius":-1,"centerX":0.5,"centerY":0.5,"kernelSize":5},
    controls: [{"key":"angle","type":"number","min":-90,"max":90},{"key":"centerX","type":"number","min":0,"max":1},{"key":"centerY","type":"number","min":0,"max":1},{"key":"kernelSize","type":"number","min":1,"max":15}]
  },
  {
    id: 'ReflectionFilter',
    displayName: 'Reflection',
    source: 'pixi-source',
    fishOnly: false,
    defaults: {"animating":true,"mirror":true,"boundary":0.5,"amplitudeStart":0,"amplitudeEnd":20,"waveLengthStart":30,"waveLengthEnd":100,"alphaStart":1,"alphaEnd":1,"time":0},
    controls: [{"key":"animating","type":"boolean"},{"key":"mirror","type":"boolean"},{"key":"boundary","type":"number","min":0,"max":1},{"key":"amplitudeStart","type":"number","min":0,"max":50},{"key":"amplitudeEnd","type":"number","min":0,"max":50},{"key":"waveLengthStart","type":"number","min":10,"max":200},{"key":"waveLengthEnd","type":"number","min":10,"max":200},{"key":"alphaStart","type":"number","min":0,"max":1},{"key":"alphaEnd","type":"number","min":0,"max":1},{"key":"time","type":"number","min":0,"max":20}]
  },
  {
    id: 'RGBSplitFilter',
    displayName: 'Rgb Split',
    source: 'pixi-source',
    fishOnly: false,
    defaults: {"redX":-10,"redY":0,"greenX":0,"greenY":0,"blueX":10,"blueY":0},
    controls: [{"key":"redX","type":"number","min":-30,"max":30},{"key":"redY","type":"number","min":-30,"max":30},{"key":"greenX","type":"number","min":-30,"max":30},{"key":"greenY","type":"number","min":-30,"max":30},{"key":"blueX","type":"number","min":-30,"max":30},{"key":"blueY","type":"number","min":-30,"max":30}]
  },
  {
    id: 'ShockwaveFilter',
    displayName: 'Shockwave',
    source: 'pixi-source',
    fishOnly: false,
    defaults: {"animating":true,"centerX":0.5,"centerY":0.5,"speed":500,"amplitude":30,"wavelength":160,"brightness":1,"radius":800,"time":0},
    controls: [{"key":"animating","type":"boolean"},{"key":"speed","type":"number","min":500,"max":2000},{"key":"amplitude","type":"number","min":1,"max":100},{"key":"wavelength","type":"number","min":2,"max":400},{"key":"brightness","type":"number","min":0.2,"max":2},{"key":"radius","type":"number","min":100,"max":2000},{"key":"centerX","type":"number","min":0,"max":1},{"key":"centerY","type":"number","min":0,"max":1}]
  },
  {
    id: 'SimpleLightmapFilter',
    displayName: 'Simple Lightmap',
    source: 'pixi-source',
    fishOnly: false,
    defaults: {"color":16777215,"alpha":1},
    controls: [{"key":"color","type":"color"},{"key":"alpha","type":"number","min":0,"max":1}]
  },
  {
    id: 'SimplexNoiseFilter',
    displayName: 'Simplex Noise',
    source: 'pixi-source',
    fishOnly: false,
    defaults: {"strength":0.25,"step":0.1},
    controls: [{"key":"strength","type":"number","min":0,"max":1},{"key":"step","type":"number","min":0,"max":1}]
  },
  {
    id: 'TiltShiftFilter',
    displayName: 'Tilt Shift',
    source: 'pixi-source',
    fishOnly: false,
    defaults: {"blur":8,"gradientBlur":600,"startX":0,"startY":0.35,"endX":1,"endY":0.65},
    controls: [{"key":"blur","type":"number","min":0,"max":30},{"key":"gradientBlur","type":"number","min":0,"max":1000},{"key":"startY","type":"number","min":0,"max":1},{"key":"endY","type":"number","min":0,"max":1}]
  },
  {
    id: 'TwistFilter',
    displayName: 'Twist',
    source: 'pixi-source',
    fishOnly: false,
    defaults: {"radius":200,"angle":4,"offsetX":0.5,"offsetY":0.5},
    controls: [{"key":"radius","type":"number","min":1,"max":500},{"key":"angle","type":"number","min":-10,"max":10},{"key":"offsetX","type":"number","min":0,"max":1},{"key":"offsetY","type":"number","min":0,"max":1}]
  },
  {
    id: 'ZoomBlurFilter',
    displayName: 'Zoom Blur',
    source: 'pixi-source',
    fishOnly: false,
    defaults: {"strength":0.1,"centerX":0.5,"centerY":0.5,"innerRadius":0,"radius":-1},
    controls: [{"key":"strength","type":"number","min":0,"max":1},{"key":"centerX","type":"number","min":0,"max":1},{"key":"centerY","type":"number","min":0,"max":1},{"key":"innerRadius","type":"number","min":0,"max":300}]
  },
  {
    id: 'AlphaFilter',
    displayName: 'Alpha',
    source: 'demo-extra',
    fishOnly: false,
    defaults: {"alpha":0.5},
    controls: [{"key":"alpha","type":"number","min":0,"max":1}]
  },
  {
    id: 'BlurFilter',
    displayName: 'Blur',
    source: 'demo-extra',
    fishOnly: false,
    defaults: {"strength":8},
    controls: [{"key":"strength","type":"number","min":0,"max":30}]
  },
  {
    id: 'ColorMatrixFilter',
    displayName: 'Color Matrix',
    source: 'demo-extra',
    fishOnly: false,
    defaults: {"saturation":0.5,"brightness":1,"contrast":1},
    controls: [{"key":"saturation","type":"number","min":0,"max":2},{"key":"brightness","type":"number","min":0,"max":2},{"key":"contrast","type":"number","min":0,"max":2}]
  },
  {
    id: 'DisplacementFilter',
    displayName: 'Displacement',
    source: 'demo-extra',
    fishOnly: false,
    defaults: {"scaleX":50,"scaleY":50,"textureKey":"map"},
    controls: [{"key":"scaleX","type":"number","min":1,"max":200},{"key":"scaleY","type":"number","min":1,"max":200}]
  },
  {
    id: 'NoiseFilter',
    displayName: 'Noise',
    source: 'demo-extra',
    fishOnly: false,
    defaults: {"noise":0.35,"seed":0},
    controls: [{"key":"noise","type":"number","min":0,"max":1},{"key":"seed","type":"number","min":0,"max":100}]
  },
] satisfies FilterMetadata[]).sort((a, b) => a.displayName.localeCompare(b.displayName));

export const FILTER_METADATA_BY_ID = Object.fromEntries(FILTER_METADATA.map((item) => [item.id, item])) as Record<string, FilterMetadata>;

const setUniformValue = (programManager: Phaser.Renderer.WebGL.ProgramManager, name: string, value: unknown): void => {
  programManager.setUniform(name, value);
};

class GeneratedFilterNode extends Phaser.Renderer.WebGL.RenderNodes.BaseFilterShader {
  readonly metadata: FilterMetadata;

  constructor(name: string, manager: Manager, metadata: FilterMetadata, body: string) {
    super(name, manager, undefined, makeFragment(body, FILTER_UNIFORMS[name.replace('Phaser', '') as keyof typeof FILTER_UNIFORMS]));
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

export class PhaserAdjustmentFilter extends GeneratedFilterNode {
  constructor(manager: Manager) {
    super('PhaserAdjustmentFilter', manager, FILTER_METADATA_BY_ID.AdjustmentFilter, FILTER_BODIES.AdjustmentFilter);
  }
}

export class AdjustmentFilter extends BaseFilterController {
  constructor(camera: Phaser.Cameras.Scene2D.Camera, options: Record<string, unknown> = {}) {
    super(camera, 'PhaserAdjustmentFilter', FILTER_METADATA_BY_ID.AdjustmentFilter, options);
  }
}

export const addAdjustmentFilter = (
  target: PhaserFilterTarget | Phaser.Cameras.Scene2D.Camera,
  options: Record<string, unknown> = {},
  space: FilterSpace = 'internal',
): AdjustmentFilter => addControllerToTarget(target, AdjustmentFilter, options, space);

export class PhaserAdvancedBloomFilter extends GeneratedFilterNode {
  constructor(manager: Manager) {
    super('PhaserAdvancedBloomFilter', manager, FILTER_METADATA_BY_ID.AdvancedBloomFilter, FILTER_BODIES.AdvancedBloomFilter);
  }
}

export class AdvancedBloomFilter extends BaseFilterController {
  constructor(camera: Phaser.Cameras.Scene2D.Camera, options: Record<string, unknown> = {}) {
    super(camera, 'PhaserAdvancedBloomFilter', FILTER_METADATA_BY_ID.AdvancedBloomFilter, options);
  }
}

export const addAdvancedBloomFilter = (
  target: PhaserFilterTarget | Phaser.Cameras.Scene2D.Camera,
  options: Record<string, unknown> = {},
  space: FilterSpace = 'internal',
): AdvancedBloomFilter => addControllerToTarget(target, AdvancedBloomFilter, options, space);

export class PhaserAsciiFilter extends GeneratedFilterNode {
  constructor(manager: Manager) {
    super('PhaserAsciiFilter', manager, FILTER_METADATA_BY_ID.AsciiFilter, FILTER_BODIES.AsciiFilter);
  }
}

export class AsciiFilter extends BaseFilterController {
  constructor(camera: Phaser.Cameras.Scene2D.Camera, options: Record<string, unknown> = {}) {
    super(camera, 'PhaserAsciiFilter', FILTER_METADATA_BY_ID.AsciiFilter, options);
  }
}

export const addAsciiFilter = (
  target: PhaserFilterTarget | Phaser.Cameras.Scene2D.Camera,
  options: Record<string, unknown> = {},
  space: FilterSpace = 'internal',
): AsciiFilter => addControllerToTarget(target, AsciiFilter, options, space);

export class PhaserBackdropBlurFilter extends GeneratedFilterNode {
  constructor(manager: Manager) {
    super('PhaserBackdropBlurFilter', manager, FILTER_METADATA_BY_ID.BackdropBlurFilter, FILTER_BODIES.BackdropBlurFilter);
  }
}

export class BackdropBlurFilter extends BaseFilterController {
  constructor(camera: Phaser.Cameras.Scene2D.Camera, options: Record<string, unknown> = {}) {
    super(camera, 'PhaserBackdropBlurFilter', FILTER_METADATA_BY_ID.BackdropBlurFilter, options);
  }
}

export const addBackdropBlurFilter = (
  target: PhaserFilterTarget | Phaser.Cameras.Scene2D.Camera,
  options: Record<string, unknown> = {},
  space: FilterSpace = 'internal',
): BackdropBlurFilter => addControllerToTarget(target, BackdropBlurFilter, options, space);

export class PhaserBevelFilter extends GeneratedFilterNode {
  constructor(manager: Manager) {
    super('PhaserBevelFilter', manager, FILTER_METADATA_BY_ID.BevelFilter, FILTER_BODIES.BevelFilter);
  }
}

export class BevelFilter extends BaseFilterController {
  constructor(camera: Phaser.Cameras.Scene2D.Camera, options: Record<string, unknown> = {}) {
    super(camera, 'PhaserBevelFilter', FILTER_METADATA_BY_ID.BevelFilter, options);
  }
}

export const addBevelFilter = (
  target: PhaserFilterTarget | Phaser.Cameras.Scene2D.Camera,
  options: Record<string, unknown> = {},
  space: FilterSpace = 'internal',
): BevelFilter => addControllerToTarget(target, BevelFilter, options, space);

export class PhaserBloomFilter extends GeneratedFilterNode {
  constructor(manager: Manager) {
    super('PhaserBloomFilter', manager, FILTER_METADATA_BY_ID.BloomFilter, FILTER_BODIES.BloomFilter);
  }
}

export class BloomFilter extends BaseFilterController {
  constructor(camera: Phaser.Cameras.Scene2D.Camera, options: Record<string, unknown> = {}) {
    super(camera, 'PhaserBloomFilter', FILTER_METADATA_BY_ID.BloomFilter, options);
  }
}

export const addBloomFilter = (
  target: PhaserFilterTarget | Phaser.Cameras.Scene2D.Camera,
  options: Record<string, unknown> = {},
  space: FilterSpace = 'internal',
): BloomFilter => addControllerToTarget(target, BloomFilter, options, space);

export class PhaserBulgePinchFilter extends GeneratedFilterNode {
  constructor(manager: Manager) {
    super('PhaserBulgePinchFilter', manager, FILTER_METADATA_BY_ID.BulgePinchFilter, FILTER_BODIES.BulgePinchFilter);
  }
}

export class BulgePinchFilter extends BaseFilterController {
  constructor(camera: Phaser.Cameras.Scene2D.Camera, options: Record<string, unknown> = {}) {
    super(camera, 'PhaserBulgePinchFilter', FILTER_METADATA_BY_ID.BulgePinchFilter, options);
  }
}

export const addBulgePinchFilter = (
  target: PhaserFilterTarget | Phaser.Cameras.Scene2D.Camera,
  options: Record<string, unknown> = {},
  space: FilterSpace = 'internal',
): BulgePinchFilter => addControllerToTarget(target, BulgePinchFilter, options, space);

export class PhaserColorGradientFilter extends GeneratedFilterNode {
  constructor(manager: Manager) {
    super('PhaserColorGradientFilter', manager, FILTER_METADATA_BY_ID.ColorGradientFilter, FILTER_BODIES.ColorGradientFilter);
  }
}

export class ColorGradientFilter extends BaseFilterController {
  constructor(camera: Phaser.Cameras.Scene2D.Camera, options: Record<string, unknown> = {}) {
    super(camera, 'PhaserColorGradientFilter', FILTER_METADATA_BY_ID.ColorGradientFilter, options);
  }
}

export const addColorGradientFilter = (
  target: PhaserFilterTarget | Phaser.Cameras.Scene2D.Camera,
  options: Record<string, unknown> = {},
  space: FilterSpace = 'internal',
): ColorGradientFilter => addControllerToTarget(target, ColorGradientFilter, options, space);

export class PhaserColorMapFilter extends GeneratedFilterNode {
  constructor(manager: Manager) {
    super('PhaserColorMapFilter', manager, FILTER_METADATA_BY_ID.ColorMapFilter, FILTER_BODIES.ColorMapFilter);
  }
}

export class ColorMapFilter extends BaseFilterController {
  constructor(camera: Phaser.Cameras.Scene2D.Camera, options: Record<string, unknown> = {}) {
    super(camera, 'PhaserColorMapFilter', FILTER_METADATA_BY_ID.ColorMapFilter, options);
  }
}

export const addColorMapFilter = (
  target: PhaserFilterTarget | Phaser.Cameras.Scene2D.Camera,
  options: Record<string, unknown> = {},
  space: FilterSpace = 'internal',
): ColorMapFilter => addControllerToTarget(target, ColorMapFilter, options, space);

export class PhaserColorOverlayFilter extends GeneratedFilterNode {
  constructor(manager: Manager) {
    super('PhaserColorOverlayFilter', manager, FILTER_METADATA_BY_ID.ColorOverlayFilter, FILTER_BODIES.ColorOverlayFilter);
  }
}

export class ColorOverlayFilter extends BaseFilterController {
  constructor(camera: Phaser.Cameras.Scene2D.Camera, options: Record<string, unknown> = {}) {
    super(camera, 'PhaserColorOverlayFilter', FILTER_METADATA_BY_ID.ColorOverlayFilter, options);
  }
}

export const addColorOverlayFilter = (
  target: PhaserFilterTarget | Phaser.Cameras.Scene2D.Camera,
  options: Record<string, unknown> = {},
  space: FilterSpace = 'internal',
): ColorOverlayFilter => addControllerToTarget(target, ColorOverlayFilter, options, space);

export class PhaserColorReplaceFilter extends GeneratedFilterNode {
  constructor(manager: Manager) {
    super('PhaserColorReplaceFilter', manager, FILTER_METADATA_BY_ID.ColorReplaceFilter, FILTER_BODIES.ColorReplaceFilter);
  }
}

export class ColorReplaceFilter extends BaseFilterController {
  constructor(camera: Phaser.Cameras.Scene2D.Camera, options: Record<string, unknown> = {}) {
    super(camera, 'PhaserColorReplaceFilter', FILTER_METADATA_BY_ID.ColorReplaceFilter, options);
  }
}

export const addColorReplaceFilter = (
  target: PhaserFilterTarget | Phaser.Cameras.Scene2D.Camera,
  options: Record<string, unknown> = {},
  space: FilterSpace = 'internal',
): ColorReplaceFilter => addControllerToTarget(target, ColorReplaceFilter, options, space);

export class PhaserConvolutionFilter extends GeneratedFilterNode {
  constructor(manager: Manager) {
    super('PhaserConvolutionFilter', manager, FILTER_METADATA_BY_ID.ConvolutionFilter, FILTER_BODIES.ConvolutionFilter);
  }
}

export class ConvolutionFilter extends BaseFilterController {
  constructor(camera: Phaser.Cameras.Scene2D.Camera, options: Record<string, unknown> = {}) {
    super(camera, 'PhaserConvolutionFilter', FILTER_METADATA_BY_ID.ConvolutionFilter, options);
  }
}

export const addConvolutionFilter = (
  target: PhaserFilterTarget | Phaser.Cameras.Scene2D.Camera,
  options: Record<string, unknown> = {},
  space: FilterSpace = 'internal',
): ConvolutionFilter => addControllerToTarget(target, ConvolutionFilter, options, space);

export class PhaserCrossHatchFilter extends GeneratedFilterNode {
  constructor(manager: Manager) {
    super('PhaserCrossHatchFilter', manager, FILTER_METADATA_BY_ID.CrossHatchFilter, FILTER_BODIES.CrossHatchFilter);
  }
}

export class CrossHatchFilter extends BaseFilterController {
  constructor(camera: Phaser.Cameras.Scene2D.Camera, options: Record<string, unknown> = {}) {
    super(camera, 'PhaserCrossHatchFilter', FILTER_METADATA_BY_ID.CrossHatchFilter, options);
  }
}

export const addCrossHatchFilter = (
  target: PhaserFilterTarget | Phaser.Cameras.Scene2D.Camera,
  options: Record<string, unknown> = {},
  space: FilterSpace = 'internal',
): CrossHatchFilter => addControllerToTarget(target, CrossHatchFilter, options, space);

export class PhaserCRTFilter extends GeneratedFilterNode {
  constructor(manager: Manager) {
    super('PhaserCRTFilter', manager, FILTER_METADATA_BY_ID.CRTFilter, FILTER_BODIES.CRTFilter);
  }
}

export class CRTFilter extends BaseFilterController {
  constructor(camera: Phaser.Cameras.Scene2D.Camera, options: Record<string, unknown> = {}) {
    super(camera, 'PhaserCRTFilter', FILTER_METADATA_BY_ID.CRTFilter, options);
  }
}

export const addCRTFilter = (
  target: PhaserFilterTarget | Phaser.Cameras.Scene2D.Camera,
  options: Record<string, unknown> = {},
  space: FilterSpace = 'internal',
): CRTFilter => addControllerToTarget(target, CRTFilter, options, space);

export class PhaserDotFilter extends GeneratedFilterNode {
  constructor(manager: Manager) {
    super('PhaserDotFilter', manager, FILTER_METADATA_BY_ID.DotFilter, FILTER_BODIES.DotFilter);
  }
}

export class DotFilter extends BaseFilterController {
  constructor(camera: Phaser.Cameras.Scene2D.Camera, options: Record<string, unknown> = {}) {
    super(camera, 'PhaserDotFilter', FILTER_METADATA_BY_ID.DotFilter, options);
  }
}

export const addDotFilter = (
  target: PhaserFilterTarget | Phaser.Cameras.Scene2D.Camera,
  options: Record<string, unknown> = {},
  space: FilterSpace = 'internal',
): DotFilter => addControllerToTarget(target, DotFilter, options, space);

export class PhaserDropShadowFilter extends GeneratedFilterNode {
  constructor(manager: Manager) {
    super('PhaserDropShadowFilter', manager, FILTER_METADATA_BY_ID.DropShadowFilter, FILTER_BODIES.DropShadowFilter);
  }
}

export class DropShadowFilter extends BaseFilterController {
  constructor(camera: Phaser.Cameras.Scene2D.Camera, options: Record<string, unknown> = {}) {
    super(camera, 'PhaserDropShadowFilter', FILTER_METADATA_BY_ID.DropShadowFilter, options);
  }
}

export const addDropShadowFilter = (
  target: PhaserFilterTarget | Phaser.Cameras.Scene2D.Camera,
  options: Record<string, unknown> = {},
  space: FilterSpace = 'internal',
): DropShadowFilter => addControllerToTarget(target, DropShadowFilter, options, space);

export class PhaserEmbossFilter extends GeneratedFilterNode {
  constructor(manager: Manager) {
    super('PhaserEmbossFilter', manager, FILTER_METADATA_BY_ID.EmbossFilter, FILTER_BODIES.EmbossFilter);
  }
}

export class EmbossFilter extends BaseFilterController {
  constructor(camera: Phaser.Cameras.Scene2D.Camera, options: Record<string, unknown> = {}) {
    super(camera, 'PhaserEmbossFilter', FILTER_METADATA_BY_ID.EmbossFilter, options);
  }
}

export const addEmbossFilter = (
  target: PhaserFilterTarget | Phaser.Cameras.Scene2D.Camera,
  options: Record<string, unknown> = {},
  space: FilterSpace = 'internal',
): EmbossFilter => addControllerToTarget(target, EmbossFilter, options, space);

export class PhaserGlitchFilter extends GeneratedFilterNode {
  constructor(manager: Manager) {
    super('PhaserGlitchFilter', manager, FILTER_METADATA_BY_ID.GlitchFilter, FILTER_BODIES.GlitchFilter);
  }
}

export class GlitchFilter extends BaseFilterController {
  constructor(camera: Phaser.Cameras.Scene2D.Camera, options: Record<string, unknown> = {}) {
    super(camera, 'PhaserGlitchFilter', FILTER_METADATA_BY_ID.GlitchFilter, options);
  }
}

export const addGlitchFilter = (
  target: PhaserFilterTarget | Phaser.Cameras.Scene2D.Camera,
  options: Record<string, unknown> = {},
  space: FilterSpace = 'internal',
): GlitchFilter => addControllerToTarget(target, GlitchFilter, options, space);

export class PhaserGlowFilter extends GeneratedFilterNode {
  constructor(manager: Manager) {
    super('PhaserGlowFilter', manager, FILTER_METADATA_BY_ID.GlowFilter, FILTER_BODIES.GlowFilter);
  }
}

export class GlowFilter extends BaseFilterController {
  constructor(camera: Phaser.Cameras.Scene2D.Camera, options: Record<string, unknown> = {}) {
    super(camera, 'PhaserGlowFilter', FILTER_METADATA_BY_ID.GlowFilter, options);
  }
}

export const addGlowFilter = (
  target: PhaserFilterTarget | Phaser.Cameras.Scene2D.Camera,
  options: Record<string, unknown> = {},
  space: FilterSpace = 'internal',
): GlowFilter => addControllerToTarget(target, GlowFilter, options, space);

export class PhaserGodrayFilter extends GeneratedFilterNode {
  constructor(manager: Manager) {
    super('PhaserGodrayFilter', manager, FILTER_METADATA_BY_ID.GodrayFilter, FILTER_BODIES.GodrayFilter);
  }
}

export class GodrayFilter extends BaseFilterController {
  constructor(camera: Phaser.Cameras.Scene2D.Camera, options: Record<string, unknown> = {}) {
    super(camera, 'PhaserGodrayFilter', FILTER_METADATA_BY_ID.GodrayFilter, options);
  }
}

export const addGodrayFilter = (
  target: PhaserFilterTarget | Phaser.Cameras.Scene2D.Camera,
  options: Record<string, unknown> = {},
  space: FilterSpace = 'internal',
): GodrayFilter => addControllerToTarget(target, GodrayFilter, options, space);

export class PhaserGrayscaleFilter extends GeneratedFilterNode {
  constructor(manager: Manager) {
    super('PhaserGrayscaleFilter', manager, FILTER_METADATA_BY_ID.GrayscaleFilter, FILTER_BODIES.GrayscaleFilter);
  }
}

export class GrayscaleFilter extends BaseFilterController {
  constructor(camera: Phaser.Cameras.Scene2D.Camera, options: Record<string, unknown> = {}) {
    super(camera, 'PhaserGrayscaleFilter', FILTER_METADATA_BY_ID.GrayscaleFilter, options);
  }
}

export const addGrayscaleFilter = (
  target: PhaserFilterTarget | Phaser.Cameras.Scene2D.Camera,
  options: Record<string, unknown> = {},
  space: FilterSpace = 'internal',
): GrayscaleFilter => addControllerToTarget(target, GrayscaleFilter, options, space);

export class PhaserHslAdjustmentFilter extends GeneratedFilterNode {
  constructor(manager: Manager) {
    super('PhaserHslAdjustmentFilter', manager, FILTER_METADATA_BY_ID.HslAdjustmentFilter, FILTER_BODIES.HslAdjustmentFilter);
  }
}

export class HslAdjustmentFilter extends BaseFilterController {
  constructor(camera: Phaser.Cameras.Scene2D.Camera, options: Record<string, unknown> = {}) {
    super(camera, 'PhaserHslAdjustmentFilter', FILTER_METADATA_BY_ID.HslAdjustmentFilter, options);
  }
}

export const addHslAdjustmentFilter = (
  target: PhaserFilterTarget | Phaser.Cameras.Scene2D.Camera,
  options: Record<string, unknown> = {},
  space: FilterSpace = 'internal',
): HslAdjustmentFilter => addControllerToTarget(target, HslAdjustmentFilter, options, space);

export class PhaserKawaseBlurFilter extends GeneratedFilterNode {
  constructor(manager: Manager) {
    super('PhaserKawaseBlurFilter', manager, FILTER_METADATA_BY_ID.KawaseBlurFilter, FILTER_BODIES.KawaseBlurFilter);
  }
}

export class KawaseBlurFilter extends BaseFilterController {
  constructor(camera: Phaser.Cameras.Scene2D.Camera, options: Record<string, unknown> = {}) {
    super(camera, 'PhaserKawaseBlurFilter', FILTER_METADATA_BY_ID.KawaseBlurFilter, options);
  }
}

export const addKawaseBlurFilter = (
  target: PhaserFilterTarget | Phaser.Cameras.Scene2D.Camera,
  options: Record<string, unknown> = {},
  space: FilterSpace = 'internal',
): KawaseBlurFilter => addControllerToTarget(target, KawaseBlurFilter, options, space);

export class PhaserMotionBlurFilter extends GeneratedFilterNode {
  constructor(manager: Manager) {
    super('PhaserMotionBlurFilter', manager, FILTER_METADATA_BY_ID.MotionBlurFilter, FILTER_BODIES.MotionBlurFilter);
  }
}

export class MotionBlurFilter extends BaseFilterController {
  constructor(camera: Phaser.Cameras.Scene2D.Camera, options: Record<string, unknown> = {}) {
    super(camera, 'PhaserMotionBlurFilter', FILTER_METADATA_BY_ID.MotionBlurFilter, options);
  }
}

export const addMotionBlurFilter = (
  target: PhaserFilterTarget | Phaser.Cameras.Scene2D.Camera,
  options: Record<string, unknown> = {},
  space: FilterSpace = 'internal',
): MotionBlurFilter => addControllerToTarget(target, MotionBlurFilter, options, space);

export class PhaserMultiColorReplaceFilter extends GeneratedFilterNode {
  constructor(manager: Manager) {
    super('PhaserMultiColorReplaceFilter', manager, FILTER_METADATA_BY_ID.MultiColorReplaceFilter, FILTER_BODIES.MultiColorReplaceFilter);
  }
}

export class MultiColorReplaceFilter extends BaseFilterController {
  constructor(camera: Phaser.Cameras.Scene2D.Camera, options: Record<string, unknown> = {}) {
    super(camera, 'PhaserMultiColorReplaceFilter', FILTER_METADATA_BY_ID.MultiColorReplaceFilter, options);
  }
}

export const addMultiColorReplaceFilter = (
  target: PhaserFilterTarget | Phaser.Cameras.Scene2D.Camera,
  options: Record<string, unknown> = {},
  space: FilterSpace = 'internal',
): MultiColorReplaceFilter => addControllerToTarget(target, MultiColorReplaceFilter, options, space);

export class PhaserOldFilmFilter extends GeneratedFilterNode {
  constructor(manager: Manager) {
    super('PhaserOldFilmFilter', manager, FILTER_METADATA_BY_ID.OldFilmFilter, FILTER_BODIES.OldFilmFilter);
  }
}

export class OldFilmFilter extends BaseFilterController {
  constructor(camera: Phaser.Cameras.Scene2D.Camera, options: Record<string, unknown> = {}) {
    super(camera, 'PhaserOldFilmFilter', FILTER_METADATA_BY_ID.OldFilmFilter, options);
  }
}

export const addOldFilmFilter = (
  target: PhaserFilterTarget | Phaser.Cameras.Scene2D.Camera,
  options: Record<string, unknown> = {},
  space: FilterSpace = 'internal',
): OldFilmFilter => addControllerToTarget(target, OldFilmFilter, options, space);

export class PhaserOutlineFilter extends GeneratedFilterNode {
  constructor(manager: Manager) {
    super('PhaserOutlineFilter', manager, FILTER_METADATA_BY_ID.OutlineFilter, FILTER_BODIES.OutlineFilter);
  }
}

export class OutlineFilter extends BaseFilterController {
  constructor(camera: Phaser.Cameras.Scene2D.Camera, options: Record<string, unknown> = {}) {
    super(camera, 'PhaserOutlineFilter', FILTER_METADATA_BY_ID.OutlineFilter, options);
  }
}

export const addOutlineFilter = (
  target: PhaserFilterTarget | Phaser.Cameras.Scene2D.Camera,
  options: Record<string, unknown> = {},
  space: FilterSpace = 'internal',
): OutlineFilter => addControllerToTarget(target, OutlineFilter, options, space);

export class PhaserPixelateFilter extends GeneratedFilterNode {
  constructor(manager: Manager) {
    super('PhaserPixelateFilter', manager, FILTER_METADATA_BY_ID.PixelateFilter, FILTER_BODIES.PixelateFilter);
  }
}

export class PixelateFilter extends BaseFilterController {
  constructor(camera: Phaser.Cameras.Scene2D.Camera, options: Record<string, unknown> = {}) {
    super(camera, 'PhaserPixelateFilter', FILTER_METADATA_BY_ID.PixelateFilter, options);
  }
}

export const addPixelateFilter = (
  target: PhaserFilterTarget | Phaser.Cameras.Scene2D.Camera,
  options: Record<string, unknown> = {},
  space: FilterSpace = 'internal',
): PixelateFilter => addControllerToTarget(target, PixelateFilter, options, space);

export class PhaserRadialBlurFilter extends GeneratedFilterNode {
  constructor(manager: Manager) {
    super('PhaserRadialBlurFilter', manager, FILTER_METADATA_BY_ID.RadialBlurFilter, FILTER_BODIES.RadialBlurFilter);
  }
}

export class RadialBlurFilter extends BaseFilterController {
  constructor(camera: Phaser.Cameras.Scene2D.Camera, options: Record<string, unknown> = {}) {
    super(camera, 'PhaserRadialBlurFilter', FILTER_METADATA_BY_ID.RadialBlurFilter, options);
  }
}

export const addRadialBlurFilter = (
  target: PhaserFilterTarget | Phaser.Cameras.Scene2D.Camera,
  options: Record<string, unknown> = {},
  space: FilterSpace = 'internal',
): RadialBlurFilter => addControllerToTarget(target, RadialBlurFilter, options, space);

export class PhaserReflectionFilter extends GeneratedFilterNode {
  constructor(manager: Manager) {
    super('PhaserReflectionFilter', manager, FILTER_METADATA_BY_ID.ReflectionFilter, FILTER_BODIES.ReflectionFilter);
  }
}

export class ReflectionFilter extends BaseFilterController {
  constructor(camera: Phaser.Cameras.Scene2D.Camera, options: Record<string, unknown> = {}) {
    super(camera, 'PhaserReflectionFilter', FILTER_METADATA_BY_ID.ReflectionFilter, options);
  }
}

export const addReflectionFilter = (
  target: PhaserFilterTarget | Phaser.Cameras.Scene2D.Camera,
  options: Record<string, unknown> = {},
  space: FilterSpace = 'internal',
): ReflectionFilter => addControllerToTarget(target, ReflectionFilter, options, space);

export class PhaserRGBSplitFilter extends GeneratedFilterNode {
  constructor(manager: Manager) {
    super('PhaserRGBSplitFilter', manager, FILTER_METADATA_BY_ID.RGBSplitFilter, FILTER_BODIES.RGBSplitFilter);
  }
}

export class RGBSplitFilter extends BaseFilterController {
  constructor(camera: Phaser.Cameras.Scene2D.Camera, options: Record<string, unknown> = {}) {
    super(camera, 'PhaserRGBSplitFilter', FILTER_METADATA_BY_ID.RGBSplitFilter, options);
  }
}

export const addRGBSplitFilter = (
  target: PhaserFilterTarget | Phaser.Cameras.Scene2D.Camera,
  options: Record<string, unknown> = {},
  space: FilterSpace = 'internal',
): RGBSplitFilter => addControllerToTarget(target, RGBSplitFilter, options, space);

export class PhaserShockwaveFilter extends GeneratedFilterNode {
  constructor(manager: Manager) {
    super('PhaserShockwaveFilter', manager, FILTER_METADATA_BY_ID.ShockwaveFilter, FILTER_BODIES.ShockwaveFilter);
  }
}

export class ShockwaveFilter extends BaseFilterController {
  constructor(camera: Phaser.Cameras.Scene2D.Camera, options: Record<string, unknown> = {}) {
    super(camera, 'PhaserShockwaveFilter', FILTER_METADATA_BY_ID.ShockwaveFilter, options);
  }
}

export const addShockwaveFilter = (
  target: PhaserFilterTarget | Phaser.Cameras.Scene2D.Camera,
  options: Record<string, unknown> = {},
  space: FilterSpace = 'internal',
): ShockwaveFilter => addControllerToTarget(target, ShockwaveFilter, options, space);

export class PhaserSimpleLightmapFilter extends GeneratedFilterNode {
  constructor(manager: Manager) {
    super('PhaserSimpleLightmapFilter', manager, FILTER_METADATA_BY_ID.SimpleLightmapFilter, FILTER_BODIES.SimpleLightmapFilter);
  }
}

export class SimpleLightmapFilter extends BaseFilterController {
  constructor(camera: Phaser.Cameras.Scene2D.Camera, options: Record<string, unknown> = {}) {
    super(camera, 'PhaserSimpleLightmapFilter', FILTER_METADATA_BY_ID.SimpleLightmapFilter, options);
  }
}

export const addSimpleLightmapFilter = (
  target: PhaserFilterTarget | Phaser.Cameras.Scene2D.Camera,
  options: Record<string, unknown> = {},
  space: FilterSpace = 'internal',
): SimpleLightmapFilter => addControllerToTarget(target, SimpleLightmapFilter, options, space);

export class PhaserSimplexNoiseFilter extends GeneratedFilterNode {
  constructor(manager: Manager) {
    super('PhaserSimplexNoiseFilter', manager, FILTER_METADATA_BY_ID.SimplexNoiseFilter, FILTER_BODIES.SimplexNoiseFilter);
  }
}

export class SimplexNoiseFilter extends BaseFilterController {
  constructor(camera: Phaser.Cameras.Scene2D.Camera, options: Record<string, unknown> = {}) {
    super(camera, 'PhaserSimplexNoiseFilter', FILTER_METADATA_BY_ID.SimplexNoiseFilter, options);
  }
}

export const addSimplexNoiseFilter = (
  target: PhaserFilterTarget | Phaser.Cameras.Scene2D.Camera,
  options: Record<string, unknown> = {},
  space: FilterSpace = 'internal',
): SimplexNoiseFilter => addControllerToTarget(target, SimplexNoiseFilter, options, space);

export class PhaserTiltShiftFilter extends GeneratedFilterNode {
  constructor(manager: Manager) {
    super('PhaserTiltShiftFilter', manager, FILTER_METADATA_BY_ID.TiltShiftFilter, FILTER_BODIES.TiltShiftFilter);
  }
}

export class TiltShiftFilter extends BaseFilterController {
  constructor(camera: Phaser.Cameras.Scene2D.Camera, options: Record<string, unknown> = {}) {
    super(camera, 'PhaserTiltShiftFilter', FILTER_METADATA_BY_ID.TiltShiftFilter, options);
  }
}

export const addTiltShiftFilter = (
  target: PhaserFilterTarget | Phaser.Cameras.Scene2D.Camera,
  options: Record<string, unknown> = {},
  space: FilterSpace = 'internal',
): TiltShiftFilter => addControllerToTarget(target, TiltShiftFilter, options, space);

export class PhaserTwistFilter extends GeneratedFilterNode {
  constructor(manager: Manager) {
    super('PhaserTwistFilter', manager, FILTER_METADATA_BY_ID.TwistFilter, FILTER_BODIES.TwistFilter);
  }
}

export class TwistFilter extends BaseFilterController {
  constructor(camera: Phaser.Cameras.Scene2D.Camera, options: Record<string, unknown> = {}) {
    super(camera, 'PhaserTwistFilter', FILTER_METADATA_BY_ID.TwistFilter, options);
  }
}

export const addTwistFilter = (
  target: PhaserFilterTarget | Phaser.Cameras.Scene2D.Camera,
  options: Record<string, unknown> = {},
  space: FilterSpace = 'internal',
): TwistFilter => addControllerToTarget(target, TwistFilter, options, space);

export class PhaserZoomBlurFilter extends GeneratedFilterNode {
  constructor(manager: Manager) {
    super('PhaserZoomBlurFilter', manager, FILTER_METADATA_BY_ID.ZoomBlurFilter, FILTER_BODIES.ZoomBlurFilter);
  }
}

export class ZoomBlurFilter extends BaseFilterController {
  constructor(camera: Phaser.Cameras.Scene2D.Camera, options: Record<string, unknown> = {}) {
    super(camera, 'PhaserZoomBlurFilter', FILTER_METADATA_BY_ID.ZoomBlurFilter, options);
  }
}

export const addZoomBlurFilter = (
  target: PhaserFilterTarget | Phaser.Cameras.Scene2D.Camera,
  options: Record<string, unknown> = {},
  space: FilterSpace = 'internal',
): ZoomBlurFilter => addControllerToTarget(target, ZoomBlurFilter, options, space);

export class PhaserAlphaFilter extends GeneratedFilterNode {
  constructor(manager: Manager) {
    super('PhaserAlphaFilter', manager, FILTER_METADATA_BY_ID.AlphaFilter, FILTER_BODIES.AlphaFilter);
  }
}

export class AlphaFilter extends BaseFilterController {
  constructor(camera: Phaser.Cameras.Scene2D.Camera, options: Record<string, unknown> = {}) {
    super(camera, 'PhaserAlphaFilter', FILTER_METADATA_BY_ID.AlphaFilter, options);
  }
}

export const addAlphaFilter = (
  target: PhaserFilterTarget | Phaser.Cameras.Scene2D.Camera,
  options: Record<string, unknown> = {},
  space: FilterSpace = 'internal',
): AlphaFilter => addControllerToTarget(target, AlphaFilter, options, space);

export class PhaserBlurFilter extends GeneratedFilterNode {
  constructor(manager: Manager) {
    super('PhaserBlurFilter', manager, FILTER_METADATA_BY_ID.BlurFilter, FILTER_BODIES.BlurFilter);
  }
}

export class BlurFilter extends BaseFilterController {
  constructor(camera: Phaser.Cameras.Scene2D.Camera, options: Record<string, unknown> = {}) {
    super(camera, 'PhaserBlurFilter', FILTER_METADATA_BY_ID.BlurFilter, options);
  }
}

export const addBlurFilter = (
  target: PhaserFilterTarget | Phaser.Cameras.Scene2D.Camera,
  options: Record<string, unknown> = {},
  space: FilterSpace = 'internal',
): BlurFilter => addControllerToTarget(target, BlurFilter, options, space);

export class PhaserColorMatrixFilter extends GeneratedFilterNode {
  constructor(manager: Manager) {
    super('PhaserColorMatrixFilter', manager, FILTER_METADATA_BY_ID.ColorMatrixFilter, FILTER_BODIES.ColorMatrixFilter);
  }
}

export class ColorMatrixFilter extends BaseFilterController {
  constructor(camera: Phaser.Cameras.Scene2D.Camera, options: Record<string, unknown> = {}) {
    super(camera, 'PhaserColorMatrixFilter', FILTER_METADATA_BY_ID.ColorMatrixFilter, options);
  }
}

export const addColorMatrixFilter = (
  target: PhaserFilterTarget | Phaser.Cameras.Scene2D.Camera,
  options: Record<string, unknown> = {},
  space: FilterSpace = 'internal',
): ColorMatrixFilter => addControllerToTarget(target, ColorMatrixFilter, options, space);

export class PhaserDisplacementFilter extends GeneratedFilterNode {
  constructor(manager: Manager) {
    super('PhaserDisplacementFilter', manager, FILTER_METADATA_BY_ID.DisplacementFilter, FILTER_BODIES.DisplacementFilter);
  }
}

export class DisplacementFilter extends BaseFilterController {
  constructor(camera: Phaser.Cameras.Scene2D.Camera, options: Record<string, unknown> = {}) {
    super(camera, 'PhaserDisplacementFilter', FILTER_METADATA_BY_ID.DisplacementFilter, options);
  }
}

export const addDisplacementFilter = (
  target: PhaserFilterTarget | Phaser.Cameras.Scene2D.Camera,
  options: Record<string, unknown> = {},
  space: FilterSpace = 'internal',
): DisplacementFilter => addControllerToTarget(target, DisplacementFilter, options, space);

export class PhaserNoiseFilter extends GeneratedFilterNode {
  constructor(manager: Manager) {
    super('PhaserNoiseFilter', manager, FILTER_METADATA_BY_ID.NoiseFilter, FILTER_BODIES.NoiseFilter);
  }
}

export class NoiseFilter extends BaseFilterController {
  constructor(camera: Phaser.Cameras.Scene2D.Camera, options: Record<string, unknown> = {}) {
    super(camera, 'PhaserNoiseFilter', FILTER_METADATA_BY_ID.NoiseFilter, options);
  }
}

export const addNoiseFilter = (
  target: PhaserFilterTarget | Phaser.Cameras.Scene2D.Camera,
  options: Record<string, unknown> = {},
  space: FilterSpace = 'internal',
): NoiseFilter => addControllerToTarget(target, NoiseFilter, options, space);


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
