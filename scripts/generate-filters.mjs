import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const out = resolve(root, '../src/filters/generated.ts');
const filtersOut = resolve(root, '../src/filters');
const colorGradientBody = "const float PI2 = 6.2831853076; vec2 centered = uv - vec2(0.5); float position = uv.y; if (uType < 0.5) { float a = radians(uAngle - 90.0); vec2 d = vec2(cos(a), sin(a)); position = clamp(dot(centered, d) + 0.5, 0.0, 1.0); } else if (uType < 1.5) { position = clamp(distance(uv, vec2(0.5)) * 2.0, 0.0, 1.0); } else { position = mod(atan(-centered.y, centered.x) + radians(uAngle), PI2) / PI2; } if (uMaxColors > 0.0) { float stepSize = 1.0 / uMaxColors; position = stepSize * (floor(position / stepSize) + 0.5); } float lastOffset = uStop0Offset; if (uStopCount > 1.5) lastOffset = uStop1Offset; if (uStopCount > 2.5) lastOffset = uStop2Offset; if (uStopCount > 3.5) lastOffset = uStop3Offset; if (uStopCount > 4.5) lastOffset = uStop4Offset; if (uStopCount > 5.5) lastOffset = uStop5Offset; if (uStopCount > 6.5) lastOffset = uStop6Offset; if (uStopCount > 7.5) lastOffset = uStop7Offset; if (uStopCount > 8.5) lastOffset = uStop8Offset; if (uStopCount > 9.5) lastOffset = uStop9Offset; if (uStopCount > 10.5) lastOffset = uStop10Offset; if (uStopCount > 11.5) lastOffset = uStop11Offset; if (uStopCount > 12.5) lastOffset = uStop12Offset; if (uStopCount > 13.5) lastOffset = uStop13Offset; if (uStopCount > 14.5) lastOffset = uStop14Offset; if (uStopCount > 15.5) lastOffset = uStop15Offset; if (position < uStop0Offset || position > lastOffset) { gl_FragColor = color; } else { vec4 fromColor = vec4(vec3(uStop0R, uStop0G, uStop0B) * uStop0Alpha, uStop0Alpha); vec4 toColor = vec4(vec3(uStop1R, uStop1G, uStop1B) * uStop1Alpha, uStop1Alpha); float fromOffset = uStop0Offset; float toOffset = uStop1Offset; if (uStopCount > 2.5 && position >= uStop1Offset && position <= uStop2Offset) { fromColor = vec4(vec3(uStop1R, uStop1G, uStop1B) * uStop1Alpha, uStop1Alpha); toColor = vec4(vec3(uStop2R, uStop2G, uStop2B) * uStop2Alpha, uStop2Alpha); fromOffset = uStop1Offset; toOffset = uStop2Offset; } if (uStopCount > 3.5 && position >= uStop2Offset && position <= uStop3Offset) { fromColor = vec4(vec3(uStop2R, uStop2G, uStop2B) * uStop2Alpha, uStop2Alpha); toColor = vec4(vec3(uStop3R, uStop3G, uStop3B) * uStop3Alpha, uStop3Alpha); fromOffset = uStop2Offset; toOffset = uStop3Offset; } if (uStopCount > 4.5 && position >= uStop3Offset && position <= uStop4Offset) { fromColor = vec4(vec3(uStop3R, uStop3G, uStop3B) * uStop3Alpha, uStop3Alpha); toColor = vec4(vec3(uStop4R, uStop4G, uStop4B) * uStop4Alpha, uStop4Alpha); fromOffset = uStop3Offset; toOffset = uStop4Offset; } if (uStopCount > 5.5 && position >= uStop4Offset && position <= uStop5Offset) { fromColor = vec4(vec3(uStop4R, uStop4G, uStop4B) * uStop4Alpha, uStop4Alpha); toColor = vec4(vec3(uStop5R, uStop5G, uStop5B) * uStop5Alpha, uStop5Alpha); fromOffset = uStop4Offset; toOffset = uStop5Offset; } if (uStopCount > 6.5 && position >= uStop5Offset && position <= uStop6Offset) { fromColor = vec4(vec3(uStop5R, uStop5G, uStop5B) * uStop5Alpha, uStop5Alpha); toColor = vec4(vec3(uStop6R, uStop6G, uStop6B) * uStop6Alpha, uStop6Alpha); fromOffset = uStop5Offset; toOffset = uStop6Offset; } if (uStopCount > 7.5 && position >= uStop6Offset && position <= uStop7Offset) { fromColor = vec4(vec3(uStop6R, uStop6G, uStop6B) * uStop6Alpha, uStop6Alpha); toColor = vec4(vec3(uStop7R, uStop7G, uStop7B) * uStop7Alpha, uStop7Alpha); fromOffset = uStop6Offset; toOffset = uStop7Offset; } if (uStopCount > 8.5 && position >= uStop7Offset && position <= uStop8Offset) { fromColor = vec4(vec3(uStop7R, uStop7G, uStop7B) * uStop7Alpha, uStop7Alpha); toColor = vec4(vec3(uStop8R, uStop8G, uStop8B) * uStop8Alpha, uStop8Alpha); fromOffset = uStop7Offset; toOffset = uStop8Offset; } if (uStopCount > 9.5 && position >= uStop8Offset && position <= uStop9Offset) { fromColor = vec4(vec3(uStop8R, uStop8G, uStop8B) * uStop8Alpha, uStop8Alpha); toColor = vec4(vec3(uStop9R, uStop9G, uStop9B) * uStop9Alpha, uStop9Alpha); fromOffset = uStop8Offset; toOffset = uStop9Offset; } if (uStopCount > 10.5 && position >= uStop9Offset && position <= uStop10Offset) { fromColor = vec4(vec3(uStop9R, uStop9G, uStop9B) * uStop9Alpha, uStop9Alpha); toColor = vec4(vec3(uStop10R, uStop10G, uStop10B) * uStop10Alpha, uStop10Alpha); fromOffset = uStop9Offset; toOffset = uStop10Offset; } if (uStopCount > 11.5 && position >= uStop10Offset && position <= uStop11Offset) { fromColor = vec4(vec3(uStop10R, uStop10G, uStop10B) * uStop10Alpha, uStop10Alpha); toColor = vec4(vec3(uStop11R, uStop11G, uStop11B) * uStop11Alpha, uStop11Alpha); fromOffset = uStop10Offset; toOffset = uStop11Offset; } if (uStopCount > 12.5 && position >= uStop11Offset && position <= uStop12Offset) { fromColor = vec4(vec3(uStop11R, uStop11G, uStop11B) * uStop11Alpha, uStop11Alpha); toColor = vec4(vec3(uStop12R, uStop12G, uStop12B) * uStop12Alpha, uStop12Alpha); fromOffset = uStop11Offset; toOffset = uStop12Offset; } if (uStopCount > 13.5 && position >= uStop12Offset && position <= uStop13Offset) { fromColor = vec4(vec3(uStop12R, uStop12G, uStop12B) * uStop12Alpha, uStop12Alpha); toColor = vec4(vec3(uStop13R, uStop13G, uStop13B) * uStop13Alpha, uStop13Alpha); fromOffset = uStop12Offset; toOffset = uStop13Offset; } if (uStopCount > 14.5 && position >= uStop13Offset && position <= uStop14Offset) { fromColor = vec4(vec3(uStop13R, uStop13G, uStop13B) * uStop13Alpha, uStop13Alpha); toColor = vec4(vec3(uStop14R, uStop14G, uStop14B) * uStop14Alpha, uStop14Alpha); fromOffset = uStop13Offset; toOffset = uStop14Offset; } if (uStopCount > 15.5 && position >= uStop14Offset && position <= uStop15Offset) { fromColor = vec4(vec3(uStop14R, uStop14G, uStop14B) * uStop14Alpha, uStop14Alpha); toColor = vec4(vec3(uStop15R, uStop15G, uStop15B) * uStop15Alpha, uStop15Alpha); fromOffset = uStop14Offset; toOffset = uStop15Offset; } float pct = clamp((position - fromOffset) / max(toOffset - fromOffset, 0.0001), 0.0, 1.0); vec4 gradient = mix(fromColor, toColor, pct) * uAlpha * color.a; gl_FragColor = uReplace > 0.5 ? gradient : gradient + color * (1.0 - gradient.a); }";

const pixiFilters = [
  ['AdjustmentFilter', 'adjustment', { gamma: 1, contrast: 1, saturation: 1, brightness: 1, red: 1, green: 1, blue: 1, alpha: 1 }, [
    ['gamma', 'number', 0, 3], ['contrast', 'number', 0, 3], ['saturation', 'number', 0, 3], ['brightness', 'number', 0, 3], ['red', 'number', 0, 3], ['green', 'number', 0, 3], ['blue', 'number', 0, 3], ['alpha', 'number', 0, 1],
  ], "color.rgb = pow(max(color.rgb, vec3(0.0)), vec3(1.0 / max(uGamma, 0.0001))); float gray = luma(color.rgb); color.rgb = mix(vec3(gray), color.rgb, uSaturation); color.rgb = ((color.rgb - 0.5) * uContrast + 0.5) * vec3(uRed, uGreen, uBlue) * uBrightness; color.a *= uAlpha; gl_FragColor = color;"],
  ['AdvancedBloomFilter', 'advanced-bloom', { threshold: 0.5, bloomScale: 1, brightness: 1, blur: 8, quality: 4 }, [['threshold', 'number', 0, 1], ['bloomScale', 'number', 0, 3], ['brightness', 'number', 0, 3], ['blur', 'number', 0, 30]], "float b = smoothstep(uThreshold, 1.0, luma(color.rgb)); vec3 glow = vec3(0.0); for (int x = -4; x <= 4; x++) { for (int y = -4; y <= 4; y++) { vec2 o = vec2(float(x), float(y)) * uBlur / max(uResolution, vec2(1.0)); glow += readInput(uv + o).rgb; }} glow /= 81.0; color.rgb = color.rgb * uBrightness + glow * b * uBloomScale; gl_FragColor = color;"],
  ['AsciiFilter', 'ascii', { size: 8 }, [['size', 'number', 2, 32]], "vec2 cell = max(vec2(uSize), vec2(1.0)) / max(uResolution, vec2(1.0)); vec2 snapped = (floor(uv / cell) + 0.5) * cell; float shade = luma(readInput(snapped).rgb); float stripe = step(fract((uv.x + uv.y) * uResolution.x / max(uSize, 1.0)), shade); gl_FragColor = vec4(vec3(stripe * shade), color.a);"],
  ['BackdropBlurFilter', 'backdrop-blur', { strength: 8 }, [['strength', 'number', 0, 30]], "vec3 sum = vec3(0.0); for (int i = -4; i <= 4; i++) { vec2 o = vec2(float(i)) * uStrength / max(uResolution, vec2(1.0)); sum += readInput(uv + o).rgb; } color.rgb = sum / 9.0; gl_FragColor = color;"],
  ['BevelFilter', 'bevel', { rotation: 45, thickness: 2, lightColor: 0xffffff, lightAlpha: 0.7, shadowColor: 0x000000, shadowAlpha: 0.7 }, [['rotation', 'number', 0, 360], ['thickness', 'number', 0, 10], ['lightColor', 'color'], ['lightAlpha', 'number', 0, 1], ['shadowColor', 'color'], ['shadowAlpha', 'number', 0, 1]], "vec2 transform = vec2(cos(radians(uRotation)), sin(radians(uRotation))) * uThickness / max(uResolution, vec2(1.0)); vec4 base = readInput(uv); float light = readInput(uv - transform).a; float shadow = readInput(uv + transform).a; vec3 lightColor = vec3(uLightColorR, uLightColorG, uLightColorB); vec3 shadowColor = vec3(uShadowColorR, uShadowColorG, uShadowColorB); base.rgb = mix(base.rgb, lightColor, clamp((base.a - light) * uLightAlpha, 0.0, 1.0)); base.rgb = mix(base.rgb, shadowColor, clamp((base.a - shadow) * uShadowAlpha, 0.0, 1.0)); gl_FragColor = vec4(base.rgb, base.a);"],
  ['BloomFilter', 'bloom', { strength: 2, strengthX: 2, strengthY: 2, quality: 4, resolution: 1, kernelSize: 5 }, [['strength', 'number', 0, 20], ['strengthX', 'number', 0, 20], ['strengthY', 'number', 0, 20]], "vec2 radius = vec2(max(uStrengthX, uStrength), max(uStrengthY, uStrength)) / max(uResolution, vec2(1.0)); vec3 blur = vec3(0.0); blur += readInput(uv + vec2(-1.0, -1.0) * radius).rgb * 0.0625; blur += readInput(uv + vec2(0.0, -1.0) * radius).rgb * 0.125; blur += readInput(uv + vec2(1.0, -1.0) * radius).rgb * 0.0625; blur += readInput(uv + vec2(-1.0, 0.0) * radius).rgb * 0.125; blur += readInput(uv).rgb * 0.25; blur += readInput(uv + vec2(1.0, 0.0) * radius).rgb * 0.125; blur += readInput(uv + vec2(-1.0, 1.0) * radius).rgb * 0.0625; blur += readInput(uv + vec2(0.0, 1.0) * radius).rgb * 0.125; blur += readInput(uv + vec2(1.0, 1.0) * radius).rgb * 0.0625; vec3 screened = 1.0 - (1.0 - color.rgb) * (1.0 - blur); color.rgb = mix(color.rgb, screened, 0.85); gl_FragColor = color;"],
  ['BulgePinchFilter', 'bulge-pinch', { radius: 100, strength: 1, centerX: 0.5, centerY: 0.5 }, [['radius', 'number', 1, 500], ['strength', 'number', -2, 2], ['centerX', 'number', 0, 1], ['centerY', 'number', 0, 1]], "vec2 center = vec2(uCenterX, uCenterY); vec2 delta = uv - center; float dist = length(delta * uResolution); float pct = clamp(1.0 - dist / max(uRadius, 1.0), 0.0, 1.0); vec2 warped = uv + delta * pct * pct * -uStrength; gl_FragColor = readInput(warped);"],
  ['ColorGradientFilter', 'color-gradient', { type: 0, alpha: 1, angle: 90, maxColors: 0, replace: false, stops: [{ offset: 0, color: 0xff0000, alpha: 1 }, { offset: 1, color: 0x0000ff, alpha: 1 }] }, [], colorGradientBody],
  ['ColorMapFilter', 'color-map', { mix: 1, nearest: false }, [['mix', 'number', 0, 1], ['nearest', 'boolean']], "float y = luma(color.rgb); vec3 mapped = vec3(smoothstep(0.0, 1.0, y), y * y, 1.0 - y); color.rgb = mix(color.rgb, mapped, uMix); gl_FragColor = color;"],
  ['ColorOverlayFilter', 'color-overlay', { color: 0xff0000, alpha: 1 }, [['color', 'color'], ['alpha', 'number', 0, 1]], "color.rgb = mix(color.rgb, vec3(uColorR, uColorG, uColorB), uAlpha); gl_FragColor = color;"],
  ['ColorReplaceFilter', 'color-replace', { originalColor: 0xff0000, newColor: 0x00ff00, epsilon: 0.4 }, [['originalColor', 'color'], ['newColor', 'color'], ['epsilon', 'number', 0, 1]], "vec3 orig = vec3(uOriginalColorR, uOriginalColorG, uOriginalColorB); vec3 next = vec3(uNewColorR, uNewColorG, uNewColorB); float m = 1.0 - smoothstep(0.0, max(uEpsilon, 0.0001), distance(color.rgb, orig)); color.rgb = mix(color.rgb, next, m); gl_FragColor = color;"],
  ['ConvolutionFilter', 'convolution', { strength: 1 }, [['strength', 'number', -3, 3]], "vec2 p = 1.0 / max(uResolution, vec2(1.0)); vec3 edge = readInput(uv).rgb * 5.0 - readInput(uv + vec2(p.x,0.0)).rgb - readInput(uv - vec2(p.x,0.0)).rgb - readInput(uv + vec2(0.0,p.y)).rgb - readInput(uv - vec2(0.0,p.y)).rgb; color.rgb = mix(color.rgb, edge, uStrength); gl_FragColor = color;"],
  ['CrossHatchFilter', 'cross-hatch', {}, [], "float lum = length(color.rgb); vec2 frag = uv * uResolution; vec4 hatch = vec4(1.0); if (lum < 1.00 && mod(frag.x + frag.y, 10.0) < 1.0) { hatch = vec4(0.0, 0.0, 0.0, 1.0); } if (lum < 0.75 && mod(frag.x - frag.y, 10.0) < 1.0) { hatch = vec4(0.0, 0.0, 0.0, 1.0); } if (lum < 0.50 && mod(frag.x + frag.y - 5.0, 10.0) < 1.0) { hatch = vec4(0.0, 0.0, 0.0, 1.0); } if (lum < 0.30 && mod(frag.x - frag.y - 5.0, 10.0) < 1.0) { hatch = vec4(0.0, 0.0, 0.0, 1.0); } gl_FragColor = hatch;"],
  ['CRTFilter', 'crt', { curvature: 1, lineWidth: 1, noise: 0.2, vignetting: 0.3 }, [['curvature', 'number', 0, 3], ['lineWidth', 'number', 0, 10], ['noise', 'number', 0, 1], ['vignetting', 'number', 0, 1]], "vec2 q = uv * 2.0 - 1.0; vec2 curved = uv + q * dot(q, q) * 0.03 * uCurvature; color = readInput(curved); float scan = 0.85 + 0.15 * sin(uv.y * uResolution.y * max(uLineWidth, 1.0)); float vig = smoothstep(1.2, uVignetting, length(q)); color.rgb *= scan * vig; color.rgb += fract(sin(dot(uv * uTime, vec2(12.9898,78.233))) * 43758.5453) * uNoise * 0.08; gl_FragColor = color;"],
  ['DotFilter', 'dot', { scale: 1, angle: 5 }, [['scale', 'number', 0.1, 4], ['angle', 'number', 0, 10]], "vec2 p = uv * uResolution / max(uScale, 0.1); float s = sin(uAngle), c = cos(uAngle); p = mat2(c, -s, s, c) * p; float pattern = sin(p.x) * sin(p.y); color.rgb *= 0.8 + 0.2 * pattern; gl_FragColor = color;"],
  ['DropShadowFilter', 'drop-shadow', { offsetX: 4, offsetY: 4, alpha: 0.5, color: 0x000000, blur: 2, quality: 3, shadowOnly: false }, [['blur', 'number', 0, 20], ['quality', 'number', 0, 20], ['alpha', 'number', 0, 1], ['offsetX', 'number', -50, 50], ['offsetY', 'number', -50, 50], ['color', 'color'], ['shadowOnly', 'boolean']], "vec2 off = vec2(uOffsetX, uOffsetY) / max(uResolution, vec2(1.0)); vec2 blurStep = vec2(max(uBlur, 0.0) + max(uQuality, 0.0) * 0.25) / max(uResolution, vec2(1.0)); float shadow = 0.0; shadow += readInput(uv - off).a * 0.30; shadow += readInput(uv - off + vec2(blurStep.x, 0.0)).a * 0.10; shadow += readInput(uv - off - vec2(blurStep.x, 0.0)).a * 0.10; shadow += readInput(uv - off + vec2(0.0, blurStep.y)).a * 0.10; shadow += readInput(uv - off - vec2(0.0, blurStep.y)).a * 0.10; shadow += readInput(uv - off + blurStep).a * 0.075; shadow += readInput(uv - off - blurStep).a * 0.075; shadow += readInput(uv - off + vec2(blurStep.x, -blurStep.y)).a * 0.075; shadow += readInput(uv - off + vec2(-blurStep.x, blurStep.y)).a * 0.075; vec4 shadowColor = vec4(vec3(uColorR, uColorG, uColorB), shadow * uAlpha); if (uShadowOnly > 0.5) { gl_FragColor = shadowColor; } else { gl_FragColor = shadowColor * (1.0 - color.a) + color; }"],
  ['EmbossFilter', 'emboss', { strength: 5 }, [['strength', 'number', 0, 20]], "vec2 p = 1.0 / max(uResolution, vec2(1.0)); vec3 e = readInput(uv - p).rgb - readInput(uv + p).rgb; color.rgb = vec3(0.5) + e * uStrength; gl_FragColor = color;"],
  ['GlitchFilter', 'glitch', { slices: 5, offset: 10, direction: 0, fillMode: 0, seed: 0 }, [['slices', 'number', 1, 20], ['offset', 'number', 0, 50], ['direction', 'number', 0, 360], ['seed', 'number', 0, 20]], "float band = floor(uv.y * max(uSlices, 1.0)); float rnd = fract(sin(band * 12.9898 + uSeed + uTime * 0.01) * 43758.5453); vec2 dir = vec2(cos(radians(uDirection)), sin(radians(uDirection))); vec2 guv = uv + dir * (rnd - 0.5) * uOffset / max(uResolution, vec2(1.0)); gl_FragColor = readInput(guv);"],
  ['GlowFilter', 'glow', { distance: 15, outerStrength: 2, innerStrength: 0, color: 0xffffff, alpha: 1, quality: 0.2, knockout: false }, [['distance', 'number', 0, 20], ['innerStrength', 'number', 0, 20], ['outerStrength', 'number', 0, 20], ['color', 'color'], ['quality', 'number', 0, 1], ['alpha', 'number', 0, 1], ['knockout', 'boolean']], "float currentInside = step(0.0, uv.x) * step(0.0, uv.y) * step(uv.x, 1.0) * step(uv.y, 1.0); color *= currentInside; float totalAlpha = 0.0; float sampleCount = 0.0; vec2 radius = vec2(max(uDistance, 0.0)) / max(uResolution, vec2(1.0)); for (int x = -4; x <= 4; x++) { for (int y = -4; y <= 4; y++) { vec2 dir = vec2(float(x), float(y)); float dist = length(dir); if (dist > 0.0 && dist <= 4.0) { vec2 sampleUv = uv + normalize(dir) * radius * (dist / 4.0); float sampleInside = step(0.0, sampleUv.x) * step(0.0, sampleUv.y) * step(sampleUv.x, 1.0) * step(sampleUv.y, 1.0); float weight = 1.0 - dist / 4.0; totalAlpha += readInput(sampleUv).a * sampleInside * weight; sampleCount += weight; } }} float alphaRatio = sampleCount > 0.0 ? clamp(totalAlpha / sampleCount, 0.0, 1.0) : 0.0; vec4 glowColor = vec4(vec3(uColorR, uColorG, uColorB), uAlpha); float innerGlowAlpha = (1.0 - alphaRatio) * uInnerStrength * color.a * uAlpha; float innerGlowStrength = min(1.0, innerGlowAlpha); vec4 innerColor = mix(color, glowColor, innerGlowStrength); float outerGlowAlpha = alphaRatio * uOuterStrength * (1.0 - color.a) * uAlpha; float outerGlowStrength = min(1.0 - innerColor.a, outerGlowAlpha); vec4 outerGlowColor = outerGlowStrength * glowColor; if (uKnockout > 0.5) { float resultAlpha = clamp(outerGlowAlpha + innerGlowAlpha, 0.0, 1.0); gl_FragColor = vec4(glowColor.rgb * resultAlpha, resultAlpha); } else { gl_FragColor = innerColor + outerGlowColor; }"],
  ['GodrayFilter', 'godray', { animating: true, time: 0, gain: 0.6, lacunarity: 2.75, alpha: 1, parallel: true, angle: 30, centerX: 0.5, centerY: -0.15 }, [['animating', 'boolean'], ['time', 'number', 0, 1], ['gain', 'number', 0, 1], ['lacunarity', 'number', 0, 5], ['alpha', 'number', 0, 1], ['parallel', 'boolean'], ['angle', 'number', -60, 60], ['centerX', 'number', -0.25, 1.25], ['centerY', 'number', -1.5, 0]], "vec2 safeResolution = max(uResolution, vec2(1.0)); float aspect = safeResolution.y / safeResolution.x; vec2 coord = vec2(uv.x, 1.0 - uv.y); float d; if (uParallel > 0.5) { float radiansAngle = radians(uAngle); float lightX = cos(radiansAngle); float lightY = sin(radiansAngle); d = lightX * coord.x + lightY * coord.y * aspect; } else { float dx = coord.x - uCenterX; float dy = (coord.y - uCenterY) * aspect; float dis = sqrt(dx * dx + dy * dy) + 0.00001; d = dy / dis; } vec3 dir = vec3(d, d, 0.0); float noise = godrayTurb(dir + vec3(uTime, 0.0, 62.1 + uTime) * 0.05, max(uLacunarity, 0.0001), uGain); noise = mix(noise, 0.0, 0.3); vec4 mist = vec4(vec3(noise), 1.0) * (1.0 - coord.y); mist *= uAlpha; gl_FragColor = color + mist;"],
  ['GrayscaleFilter', 'grayscale', { amount: 1 }, [['amount', 'number', 0, 1]], "color.rgb = mix(color.rgb, vec3(luma(color.rgb)), uAmount); gl_FragColor = color;"],
  ['HslAdjustmentFilter', 'hsl-adjustment', { hue: 0, saturation: 1, lightness: 0, colorize: false }, [['hue', 'number', -180, 180], ['saturation', 'number', 0, 3], ['lightness', 'number', -1, 1], ['colorize', 'boolean']], "float a = radians(uHue); mat3 rot = mat3(0.213 + cos(a)*0.787 - sin(a)*0.213, 0.715 - cos(a)*0.715 - sin(a)*0.715, 0.072 - cos(a)*0.072 + sin(a)*0.928, 0.213 - cos(a)*0.213 + sin(a)*0.143, 0.715 + cos(a)*0.285 + sin(a)*0.140, 0.072 - cos(a)*0.072 - sin(a)*0.283, 0.213 - cos(a)*0.213 - sin(a)*0.787, 0.715 - cos(a)*0.715 + sin(a)*0.715, 0.072 + cos(a)*0.928 + sin(a)*0.072); color.rgb = rot * color.rgb; color.rgb = mix(vec3(luma(color.rgb)), color.rgb, uSaturation) + uLightness; gl_FragColor = color;"],
  ['KawaseBlurFilter', 'kawase-blur', { strength: 4, quality: 3, pixelSizeX: 1, pixelSizeY: 1, clamp: true }, [['strength', 'number', 0, 20], ['quality', 'number', 1, 20], ['pixelSizeX', 'number', 0, 10], ['pixelSizeY', 'number', 0, 10], ['clamp', 'boolean']], "float quality = clamp(floor(uQuality + 0.5), 1.0, 12.0); vec2 pixelSize = max(vec2(uPixelSizeX, uPixelSizeY), vec2(0.0)); vec4 sum = readInput(uv) * 0.5; float total = 0.5; for (int i = 0; i < 12; i++) { float fi = float(i); if (fi < quality && uStrength > 0.0) { float kernel = ((quality - fi) / quality) * uStrength + 0.5; vec2 offset = kernel * pixelSize / max(uResolution, vec2(1.0)); vec2 uv1 = uv + offset; vec2 uv2 = uv - offset; vec2 uv3 = uv + vec2(offset.x, -offset.y); vec2 uv4 = uv + vec2(-offset.x, offset.y); if (uClamp > 0.5) { uv1 = clamp(uv1, vec2(0.0), vec2(1.0)); uv2 = clamp(uv2, vec2(0.0), vec2(1.0)); uv3 = clamp(uv3, vec2(0.0), vec2(1.0)); uv4 = clamp(uv4, vec2(0.0), vec2(1.0)); } float weight = 1.0 - fi / max(quality, 1.0); sum += (readInput(uv1) + readInput(uv2) + readInput(uv3) + readInput(uv4)) * (0.25 * weight); total += weight; }} gl_FragColor = sum / max(total, 0.0001);"],
  ['MotionBlurFilter', 'motion-blur', { velocityX: 12, velocityY: 0, kernelSize: 5, offset: 0 }, [['velocityX', 'number', -50, 50], ['velocityY', 'number', -50, 50], ['kernelSize', 'number', 1, 15], ['offset', 'number', -1, 1]], "vec2 v = vec2(uVelocityX, uVelocityY) / max(uResolution, vec2(1.0)); vec4 sum = vec4(0.0); for (int i = -4; i <= 4; i++) { sum += readInput(uv + v * (float(i) / 4.0 + uOffset)); } gl_FragColor = sum / 9.0;"],
  ['MultiColorReplaceFilter', 'multi-color-replace', { epsilon: 0.2, originalColor: 0xff0000, targetColor: 0x00ff00 }, [['epsilon', 'number', 0, 1], ['originalColor', 'color'], ['targetColor', 'color']], "vec3 orig = vec3(uOriginalColorR, uOriginalColorG, uOriginalColorB); vec3 next = vec3(uTargetColorR, uTargetColorG, uTargetColorB); float m = 1.0 - smoothstep(0.0, max(uEpsilon, 0.0001), distance(color.rgb, orig)); color.rgb = mix(color.rgb, next, m); gl_FragColor = color;"],
  ['OldFilmFilter', 'old-film', { sepia: 0.3, noise: 0.3, noiseSize: 1, scratch: 0.5, scratchDensity: 0.3, scratchWidth: 1, vignetting: 0.3, vignettingAlpha: 1, vignettingBlur: 0.3, seed: 0 }, [['sepia', 'number', 0, 1], ['noise', 'number', 0, 1], ['noiseSize', 'number', 1, 10], ['scratch', 'number', -1, 1], ['scratchDensity', 'number', 0, 1], ['scratchWidth', 'number', 1, 20], ['vignetting', 'number', 0, 1], ['vignettingAlpha', 'number', 0, 1], ['vignettingBlur', 'number', 0, 1]], "const float SQRT_2 = 1.414213; vec3 sepiaRgb = vec3(112.0 / 255.0, 66.0 / 255.0, 20.0 / 255.0); float randomSeed = max(uSeed, 0.0001); if (uSepia > 0.0) { float gray = (color.r + color.g + color.b) / 3.0; vec3 grayscale = vec3(gray); vec3 overlay = vec3(grayscale.r <= 0.5 ? 2.0 * sepiaRgb.r * grayscale.r : 1.0 - 2.0 * (1.0 - sepiaRgb.r) * (1.0 - grayscale.r), grayscale.g <= 0.5 ? 2.0 * sepiaRgb.g * grayscale.g : 1.0 - 2.0 * (1.0 - sepiaRgb.g) * (1.0 - grayscale.g), grayscale.b <= 0.5 ? 2.0 * sepiaRgb.b * grayscale.b : 1.0 - 2.0 * (1.0 - sepiaRgb.b) * (1.0 - grayscale.b)); color.rgb = grayscale + uSepia * (overlay - grayscale); } if (uVignetting > 0.0) { float outter = SQRT_2 - uVignetting * SQRT_2; vec2 dir = vec2(0.5) - uv; dir.y *= uResolution.y / max(uResolution.x, 1.0); float darker = clamp((outter - length(dir) * SQRT_2) / (0.00001 + max(uVignettingBlur, 0.0) * SQRT_2), 0.0, 1.0); color.rgb *= darker + (1.0 - darker) * (1.0 - uVignettingAlpha); } if (uScratchDensity > randomSeed && uScratch != 0.0) { float phase = randomSeed * 256.0; float s = mod(floor(phase), 2.0); float dist = 1.0 / max(uScratchDensity, 0.0001); float d = distance(uv, vec2(randomSeed * dist, abs(s - randomSeed * dist))); if (d < randomSeed * 0.6 + 0.4) { float period = uScratchDensity * 10.0; float xx = uv.x * period + phase; float aa = abs(mod(xx, 0.5) * 4.0); float bb = mod(floor(xx / 0.5), 2.0); float yy = (1.0 - bb) * aa + bb * (2.0 - aa); float kk = 2.0 * period; float dw = uScratchWidth / max(uResolution.x, 1.0) * (0.75 + randomSeed); float dh = dw * kk; float tine = yy - (2.0 - dh); if (tine > 0.0) { float scratchSign = sign(uScratch); tine = s * tine / max(period, 0.0001) + uScratch + 0.1; tine = clamp(tine + 1.0, 0.5 + scratchSign * 0.5, 1.5 + scratchSign * 0.5); color.rgb *= tine; } }} if (uNoise > 0.0 && uNoiseSize > 0.0) { vec2 pixelCoord = uv * uResolution; pixelCoord = floor(pixelCoord / uNoiseSize); float filmNoise = fract(sin(dot(pixelCoord * uNoiseSize * randomSeed, vec2(12.9898, 78.233))) * 43758.5453) - 0.5; color.rgb += filmNoise * uNoise; } gl_FragColor = color;"],
  ['OutlineFilter', 'outline', { thickness: 3, color: 0xffffff, alpha: 1 }, [['thickness', 'number', 0, 20], ['color', 'color'], ['alpha', 'number', 0, 1]], "float currentInside = step(0.0, uv.x) * step(0.0, uv.y) * step(uv.x, 1.0) * step(uv.y, 1.0); color *= currentInside; float edge = 0.0; vec2 radius = vec2(max(uThickness, 0.0)) / max(uResolution, vec2(1.0)); for (int x=-4; x<=4; x++) { for (int y=-4; y<=4; y++) { vec2 dir = vec2(float(x), float(y)); float dist = length(dir); if (dist > 0.0 && dist <= 4.0) { vec2 sampleUv = uv + normalize(dir) * radius * (dist / 4.0); float sampleInside = step(0.0, sampleUv.x) * step(0.0, sampleUv.y) * step(sampleUv.x, 1.0) * step(sampleUv.y, 1.0); edge = max(edge, readInput(sampleUv).a * sampleInside); } }} vec4 outline = vec4(vec3(uColorR, uColorG, uColorB), edge * uAlpha); gl_FragColor = color + outline * (1.0 - color.a);"],
  ['PixelateFilter', 'pixelate', { sizeX: 10, sizeY: 10 }, [['sizeX', 'number', 1, 80], ['sizeY', 'number', 1, 80]], "vec2 size = max(vec2(uSizeX, uSizeY), vec2(1.0)); vec2 p = size / max(uResolution, vec2(1.0)); gl_FragColor = readInput((floor(uv / p) + 0.5) * p);"],
  ['RadialBlurFilter', 'radial-blur', { angle: 20, radius: -1, centerX: 0.5, centerY: 0.5, kernelSize: 5 }, [['angle', 'number', -90, 90], ['centerX', 'number', 0, 1], ['centerY', 'number', 0, 1], ['kernelSize', 'number', 1, 15]], "vec2 c = vec2(uCenterX, uCenterY); vec4 sum = vec4(0.0); for (int i=-4; i<=4; i++) { float t = float(i) / 4.0 * radians(uAngle) * 0.02; vec2 d = uv - c; vec2 r = vec2(d.x*cos(t)-d.y*sin(t), d.x*sin(t)+d.y*cos(t)); sum += readInput(c + r); } gl_FragColor = sum / 9.0;"],
  ['ReflectionFilter', 'reflection', { animating: true, mirror: true, boundary: 0.5, amplitudeStart: 0, amplitudeEnd: 20, waveLengthStart: 30, waveLengthEnd: 100, alphaStart: 1, alphaEnd: 1, time: 0 }, [['animating', 'boolean'], ['mirror', 'boolean'], ['boundary', 'number', 0, 1], ['amplitudeStart', 'number', 0, 50], ['amplitudeEnd', 'number', 0, 50], ['waveLengthStart', 'number', 10, 200], ['waveLengthEnd', 'number', 10, 200], ['alphaStart', 'number', 0, 1], ['alphaEnd', 'number', 0, 1], ['time', 'number', 0, 20]], "vec2 safeResolution = max(uResolution, vec2(1.0)); float visualY = 1.0 - uv.y; if (visualY < uBoundary) { gl_FragColor = color; return; } float k = (visualY - uBoundary) / max(1.0 - uBoundary, 0.0001); float reflectedVisualY = uBoundary + uBoundary - visualY; float y = uMirror > 0.5 ? 1.0 - reflectedVisualY : uv.y; float amplitude = mix(uAmplitudeStart, uAmplitudeEnd, k) / safeResolution.x; float waveLength = mix(uWaveLengthStart, uWaveLengthEnd, k) / safeResolution.y; float alpha = mix(uAlphaStart, uAlphaEnd, k); float x = uv.x + cos(y * 6.28318530718 / max(waveLength, 0.0001) - uTime) * amplitude; vec2 reflectionUv = clamp(vec2(x, y), vec2(0.0), vec2(1.0)); gl_FragColor = readInput(reflectionUv) * alpha;"],
  ['RGBSplitFilter', 'rgb-split', { redX: -10, redY: 0, greenX: 0, greenY: 0, blueX: 10, blueY: 0 }, [['redX', 'number', -30, 30], ['redY', 'number', -30, 30], ['greenX', 'number', -30, 30], ['greenY', 'number', -30, 30], ['blueX', 'number', -30, 30], ['blueY', 'number', -30, 30]], "vec2 r = vec2(uRedX, uRedY) / max(uResolution, vec2(1.0)); vec2 g = vec2(uGreenX, uGreenY) / max(uResolution, vec2(1.0)); vec2 b = vec2(uBlueX, uBlueY) / max(uResolution, vec2(1.0)); gl_FragColor = vec4(readInput(uv+r).r, readInput(uv+g).g, readInput(uv+b).b, color.a);"],
  ['ShockwaveFilter', 'shockwave', { animating: true, centerX: 0.5, centerY: 0.5, speed: 500, amplitude: 30, wavelength: 160, brightness: 1, radius: 800, time: 0 }, [['animating', 'boolean'], ['speed', 'number', 500, 2000], ['amplitude', 'number', 1, 100], ['wavelength', 'number', 2, 400], ['brightness', 'number', 0.2, 2], ['radius', 'number', 100, 2000], ['centerX', 'number', 0, 1], ['centerY', 'number', 0, 1]], "const float PI = 3.14159; vec2 safeResolution = max(uResolution, vec2(1.0)); vec2 centerUv = vec2(uCenterX, uCenterY); float halfWavelength = uWavelength * 0.5 / safeResolution.x; float maxRadius = uRadius / safeResolution.x; float currentRadius = uTime * uSpeed / safeResolution.x; float fade = 1.0; if (maxRadius > 0.0) { if (currentRadius > maxRadius) { gl_FragColor = color; return; } fade = 1.0 - pow(currentRadius / maxRadius, 2.0); } vec2 dir = uv - centerUv; dir.y *= safeResolution.y / safeResolution.x; float dist = length(dir); if (dist <= 0.0 || dist < currentRadius - halfWavelength || dist > currentRadius + halfWavelength) { gl_FragColor = color; return; } vec2 diffUv = normalize(dir); float diff = (dist - currentRadius) / max(halfWavelength, 0.00001); float p = 1.0 - pow(abs(diff), 2.0); float powDiff = 1.25 * sin(diff * PI) * p * (uAmplitude * fade); vec2 coord = uv + diffUv * powDiff / safeResolution; vec2 clampedCoord = clamp(coord, vec2(0.0), vec2(1.0)); vec4 waveColor = readInput(clampedCoord); if (coord != clampedCoord) { waveColor *= max(0.0, 1.0 - length(coord - clampedCoord)); } waveColor.rgb *= 1.0 + (uBrightness - 1.0) * p * fade; gl_FragColor = waveColor;"],
  ['SimpleLightmapFilter', 'simple-lightmap', { color: 0xffffff, alpha: 1 }, [['color', 'color'], ['alpha', 'number', 0, 1]], "vec2 q = uv - 0.5; float light = smoothstep(0.8, 0.0, length(q)); color.rgb *= mix(vec3(1.0), vec3(uColorR, uColorG, uColorB) * (1.0 + light), uAlpha); gl_FragColor = color;"],
  ['SimplexNoiseFilter', 'simplex-noise', { strength: 0.25, step: 0.1 }, [['strength', 'number', 0, 1], ['step', 'number', 0, 1]], "float n = fract(sin(dot(floor(uv * uResolution * max(uStep, 0.01)), vec2(12.9898,78.233))) * 43758.5453); color.rgb += (n - 0.5) * uStrength; gl_FragColor = color;"],
  ['TiltShiftFilter', 'tilt-shift', { blur: 100, gradientBlur: 600, startX: 0, startY: 0.5, endX: 1, endY: 0.5 }, [['blur', 'number', 0, 200], ['gradientBlur', 'number', 0, 1000], ['startX', 'number', 0, 1], ['startY', 'number', 0, 1], ['endX', 'number', 0, 1], ['endY', 'number', 0, 1]], "vec2 safeResolution = max(uResolution, vec2(1.0)); vec2 start = vec2(uStartX, uStartY) * safeResolution; vec2 end = vec2(uEndX, uEndY) * safeResolution; vec2 axis = end - start; float axisLength = max(length(axis), 0.0001); vec2 lineDir = axis / axisLength; vec2 normal = vec2(-lineDir.y, lineDir.x); float distanceFromLine = abs(dot(uv * safeResolution - start, normal)); float radius = smoothstep(0.0, 1.0, distanceFromLine / max(uGradientBlur, 0.0001)) * uBlur; if (radius < 0.01) { gl_FragColor = color; return; } vec4 sum = vec4(0.0); float total = 0.0; for (int x = -8; x <= 8; x++) { float px = float(x) / 8.0; float wx = 1.0 - abs(px); for (int y = -8; y <= 8; y++) { float py = float(y) / 8.0; float wy = 1.0 - abs(py); float weight = wx * wy; vec2 offset = (lineDir * px + normal * py) * radius / safeResolution; vec4 sampleColor = readInput(clamp(uv + offset, vec2(0.0), vec2(1.0))); sampleColor.rgb *= sampleColor.a; sum += sampleColor * weight; total += weight; }} vec4 result = sum / max(total, 0.0001); result.rgb /= result.a + 0.00001; gl_FragColor = result;"],
  ['TwistFilter', 'twist', { radius: 200, angle: 4, offsetX: 0.5, offsetY: 0.5 }, [['radius', 'number', 1, 500], ['angle', 'number', -10, 10], ['offsetX', 'number', 0, 1], ['offsetY', 'number', 0, 1]], "vec2 c = vec2(uOffsetX, uOffsetY); vec2 d = uv - c; float dist = length(d * uResolution); float pct = clamp(1.0 - dist / max(uRadius, 1.0), 0.0, 1.0); float a = pct * pct * uAngle; vec2 r = vec2(d.x*cos(a)-d.y*sin(a), d.x*sin(a)+d.y*cos(a)); gl_FragColor = readInput(c + r);"],
  ['ZoomBlurFilter', 'zoom-blur', { strength: 0.1, centerX: 0.5, centerY: 0.5, innerRadius: 0, radius: -1 }, [['strength', 'number', 0, 1], ['centerX', 'number', 0, 1], ['centerY', 'number', 0, 1], ['innerRadius', 'number', 0, 300]], "vec2 c = vec2(uCenterX, uCenterY); vec4 sum = vec4(0.0); for (int i=0; i<9; i++) { float t = float(i) / 8.0; sum += readInput(mix(uv, c, t * uStrength)); } gl_FragColor = sum / 9.0;"],
];

const extras = [
  ['AlphaFilter', 'alpha', { alpha: 0.5 }, [['alpha', 'number', 0, 1]], 'color.a *= uAlpha; gl_FragColor = color;'],
  ['BlurFilter', 'blur', { blur: 8, quality: 4 }, [['blur', 'number', 0, 100], ['quality', 'number', 1, 10]], 'float quality = clamp(floor(uQuality + 0.5), 1.0, 10.0); if (uBlur <= 0.0) { gl_FragColor = color; return; } vec4 sum = vec4(0.0); float total = 0.0; vec2 safeResolution = max(uResolution, vec2(1.0)); for (int x = -10; x <= 10; x++) { float fx = float(x); if (abs(fx) <= quality) { float px = fx / quality; float wx = exp(-px * px * 3.5); for (int y = -10; y <= 10; y++) { float fy = float(y); if (abs(fy) <= quality) { float py = fy / quality; float wy = exp(-py * py * 3.5); float weight = wx * wy; vec2 offset = vec2(px, py) * uBlur / safeResolution; vec4 sampleColor = readInput(clamp(uv + offset, vec2(0.0), vec2(1.0))); sampleColor.rgb *= sampleColor.a; sum += sampleColor * weight; total += weight; } }} } vec4 result = sum / max(total, 0.0001); result.rgb /= result.a + 0.00001; gl_FragColor = result;'],
  ['ColorMatrixFilter', 'color-matrix', { saturation: 0.5, brightness: 1, contrast: 1 }, [['saturation', 'number', 0, 2], ['brightness', 'number', 0, 2], ['contrast', 'number', 0, 2]], 'float gray = luma(color.rgb); color.rgb = mix(vec3(gray), color.rgb, uSaturation); color.rgb = ((color.rgb - 0.5) * uContrast + 0.5) * uBrightness; gl_FragColor = color;'],
  ['DisplacementFilter', 'displacement', { scaleX: 50, scaleY: 50, textureKey: 'map' }, [['scaleX', 'number', 1, 200], ['scaleY', 'number', 1, 200]], 'vec2 map = texture2D(uDisplacementSampler, uv).rg - vec2(0.5); vec2 offset = map * vec2(uScaleX, uScaleY) / max(uResolution, vec2(1.0)); gl_FragColor = readInput(uv + offset);'],
  ['NoiseFilter', 'noise', { noise: 0.35, seed: 0 }, [['noise', 'number', 0, 1], ['seed', 'number', 0, 100]], 'float n = fract(sin(dot(uv * uResolution + uSeed + uTime, vec2(12.9898,78.233))) * 43758.5453); color.rgb += (n - 0.5) * uNoise; gl_FragColor = color;'],
];

const all = [...pixiFilters.map((x) => [...x, 'pixi-source']), ...extras.map((x) => [...x, 'demo-extra'])];

const upperUniform = (key) => `u${key[0].toUpperCase()}${key.slice(1)}`;
const colorUniforms = (key) => {
  const base = key[0].toUpperCase() + key.slice(1);
  return [`u${base}R`, `u${base}G`, `u${base}B`];
};
const isColorKey = (key) => key !== 'maxColors' && key.toLowerCase().includes('color');

const uniformDeclarations = (defaults) => Object.keys(defaults).flatMap((key) => {
  if (key === 'time' || key === 'resolution' || key === 'stops' || key === 'textureKey') {
    return [];
  }

  if (isColorKey(key)) {
    return colorUniforms(key).map((name) => `uniform float ${name};`);
  }

  return [`uniform float ${upperUniform(key)};`];
}).join('\n');

const phaserFilterHeader = `
precision mediump float;

uniform sampler2D uMainSampler;
uniform vec2 uResolution;
uniform float uTime;
varying vec2 outTexCoord;

vec4 readInput(vec2 uv) {
  return texture2D(uMainSampler, uv);
}

float luma(vec3 color) {
  return dot(color, vec3(0.299, 0.587, 0.114));
}
`;

const makeFragment = (body, declarations = '') => `${phaserFilterHeader}
${declarations}
void main(void) {
  vec2 uv = outTexCoord;
  vec4 color = readInput(uv);
  ${body}
}
`;

const fishOnlyFilters = new Set(['BevelFilter', 'ColorGradientFilter', 'ColorOverlayFilter', 'GlowFilter', 'OutlineFilter', 'DropShadowFilter']);
const displayName = (slug) => slug.replace(/-/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase());
const optionTypeForValue = (key, value) => {
  if (key === 'stops') {
    return 'Array<{ offset: number; color: number | string | number[]; alpha: number }>';
  }

  if (key === 'textureKey') {
    return 'string';
  }

  if (key !== 'maxColors' && key.toLowerCase().includes('color')) {
    return 'number | string | number[]';
  }

  if (typeof value === 'boolean') {
    return 'boolean';
  }

  if (typeof value === 'number') {
    return 'number';
  }

  if (Array.isArray(value) || value instanceof Float32Array) {
    return 'number[]';
  }

  return 'unknown';
};

const declarationsForFilter = (className, defaults) => {
  const godrayNoise = `float godrayHash(vec3 p) {
  p = fract(p * 0.3183099 + vec3(0.1, 0.2, 0.3));
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}
float godrayNoise(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float n000 = godrayHash(i + vec3(0.0, 0.0, 0.0));
  float n100 = godrayHash(i + vec3(1.0, 0.0, 0.0));
  float n010 = godrayHash(i + vec3(0.0, 1.0, 0.0));
  float n110 = godrayHash(i + vec3(1.0, 1.0, 0.0));
  float n001 = godrayHash(i + vec3(0.0, 0.0, 1.0));
  float n101 = godrayHash(i + vec3(1.0, 0.0, 1.0));
  float n011 = godrayHash(i + vec3(0.0, 1.0, 1.0));
  float n111 = godrayHash(i + vec3(1.0, 1.0, 1.0));
  float nx00 = mix(n000, n100, f.x);
  float nx10 = mix(n010, n110, f.x);
  float nx01 = mix(n001, n101, f.x);
  float nx11 = mix(n011, n111, f.x);
  float nxy0 = mix(nx00, nx10, f.y);
  float nxy1 = mix(nx01, nx11, f.y);
  return mix(nxy0, nxy1, f.z);
}
float godrayTurb(vec3 p, float lacunarity, float gain) {
  float sum = 0.0;
  float scale = 1.0;
  float amplitude = 1.0;
  for (int i = 0; i < 6; i++) {
    sum += amplitude * (godrayNoise(p * scale) * 2.0 - 1.0);
    scale *= lacunarity;
    amplitude *= gain;
  }
  return abs(sum);
}`;

  if (className === 'ColorGradientFilter') {
    return `${uniformDeclarations(defaults)}
uniform float uStopCount;
${Array.from({ length: 16 }, (_, index) => `uniform float uStop${index}R;
uniform float uStop${index}G;
uniform float uStop${index}B;
uniform float uStop${index}Offset;
uniform float uStop${index}Alpha;`).join('\n')}`;
  }

  if (className === 'DisplacementFilter') {
    return `${uniformDeclarations(defaults)}
uniform sampler2D uDisplacementSampler;`;
  }

  if (className === 'GodrayFilter') {
    return `${uniformDeclarations(defaults)}
${godrayNoise}`;
  }

  return uniformDeclarations(defaults);
};

const filterModuleSource = (className, slug, defaults, controls, source) => {
  const nodeName = `Phaser${className}`;
  const metadataName = `${className}Metadata`;
  const optionsName = `${className}Options`;
  const controlsMetadata = controls.map(([key, type, min, max]) => ({ key, type, min, max }));
  const optionFields = Object.entries(defaults)
    .map(([key, value]) => `  ${key}?: ${optionTypeForValue(key, value)};`)
    .join('\n');

  return `import Phaser from 'phaser';
import fragmentSource from './${slug}.frag?raw';
import {
  addControllerToTarget,
  BaseFilterController,
  FilterMetadata,
  FilterSpace,
  GeneratedFilterNode,
  PhaserFilterTarget,
} from '../runtime';

type Manager = Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager;

export interface ${optionsName} {
${optionFields || '  [key: string]: unknown;'}
}

export const ${metadataName} = {
  id: '${className}',
  displayName: '${displayName(slug)}',
  source: '${source}',
  fishOnly: ${fishOnlyFilters.has(className) ? 'true' : 'false'},
  defaults: ${JSON.stringify(defaults)},
  controls: ${JSON.stringify(controlsMetadata)}
} satisfies FilterMetadata;

export class ${nodeName} extends GeneratedFilterNode {
  constructor(manager: Manager) {
    super('${nodeName}', manager, ${metadataName}, fragmentSource);
  }
}

export class ${className} extends BaseFilterController {
  constructor(camera: Phaser.Cameras.Scene2D.Camera, options: ${optionsName} = {}) {
    super(camera, '${nodeName}', ${metadataName}, options as Record<string, unknown>);
  }
}

export const add${className} = (
  target: PhaserFilterTarget | Phaser.Cameras.Scene2D.Camera,
  options: ${optionsName} = {},
  space: FilterSpace = 'internal',
): ${className} => addControllerToTarget(target, ${className}, options as Record<string, unknown>, space);
`;
};

const generatedSource = `import Phaser from 'phaser';
import { FilterMetadata } from './runtime';
${all.map(([className, slug]) => `import {
  ${className},
  ${className}Metadata,
  Phaser${className},
  add${className},
} from './${slug}';`).join('\n')}

${all.map(([className, slug]) => `export * from './${slug}';`).join('\n')}

export const FILTER_METADATA = ([
${all.map(([className]) => `  ${className}Metadata,`).join('\n')}
] satisfies FilterMetadata[]).sort((a, b) => a.displayName.localeCompare(b.displayName));

export const FILTER_METADATA_BY_ID = Object.fromEntries(FILTER_METADATA.map((item) => [item.id, item])) as Record<string, FilterMetadata>;

export const FILTER_RENDER_NODES = {
${all.map(([className]) => `  Phaser${className},`).join('\n')}
};

export const FILTER_CONTROLLERS = {
${all.map(([className]) => `  ${className},`).join('\n')}
};

export const FILTER_ADDERS = {
${all.map(([className]) => `  ${className}: add${className},`).join('\n')}
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
`;

mkdirSync(dirname(out), { recursive: true });

for (const [className, slug, defaults, controls, body, source] of all) {
  const filterDir = resolve(filtersOut, slug);
  mkdirSync(filterDir, { recursive: true });
  writeFileSync(resolve(filterDir, `${slug}.frag`), makeFragment(body, declarationsForFilter(className, defaults)));
  writeFileSync(resolve(filterDir, `${className}.ts`), filterModuleSource(className, slug, defaults, controls, source));
  writeFileSync(resolve(filterDir, 'index.ts'), `export * from './${className}';\n`);
}

writeFileSync(out, generatedSource);
