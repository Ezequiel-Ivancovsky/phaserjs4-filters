
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

uniform float uSepia;
uniform float uNoise;
uniform float uNoiseSize;
uniform float uScratch;
uniform float uScratchDensity;
uniform float uScratchWidth;
uniform float uVignetting;
uniform float uVignettingAlpha;
uniform float uVignettingBlur;
uniform float uSeed;
void main(void) {
  vec2 uv = outTexCoord;
  vec4 color = readInput(uv);
  const float SQRT_2 = 1.414213; vec3 sepiaRgb = vec3(112.0 / 255.0, 66.0 / 255.0, 20.0 / 255.0); float randomSeed = max(uSeed, 0.0001); if (uSepia > 0.0) { float gray = (color.r + color.g + color.b) / 3.0; vec3 grayscale = vec3(gray); vec3 overlay = vec3(grayscale.r <= 0.5 ? 2.0 * sepiaRgb.r * grayscale.r : 1.0 - 2.0 * (1.0 - sepiaRgb.r) * (1.0 - grayscale.r), grayscale.g <= 0.5 ? 2.0 * sepiaRgb.g * grayscale.g : 1.0 - 2.0 * (1.0 - sepiaRgb.g) * (1.0 - grayscale.g), grayscale.b <= 0.5 ? 2.0 * sepiaRgb.b * grayscale.b : 1.0 - 2.0 * (1.0 - sepiaRgb.b) * (1.0 - grayscale.b)); color.rgb = grayscale + uSepia * (overlay - grayscale); } if (uVignetting > 0.0) { float outter = SQRT_2 - uVignetting * SQRT_2; vec2 dir = vec2(0.5) - uv; dir.y *= uResolution.y / max(uResolution.x, 1.0); float darker = clamp((outter - length(dir) * SQRT_2) / (0.00001 + max(uVignettingBlur, 0.0) * SQRT_2), 0.0, 1.0); color.rgb *= darker + (1.0 - darker) * (1.0 - uVignettingAlpha); } if (uScratchDensity > randomSeed && uScratch != 0.0) { float phase = randomSeed * 256.0; float s = mod(floor(phase), 2.0); float dist = 1.0 / max(uScratchDensity, 0.0001); float d = distance(uv, vec2(randomSeed * dist, abs(s - randomSeed * dist))); if (d < randomSeed * 0.6 + 0.4) { float period = uScratchDensity * 10.0; float xx = uv.x * period + phase; float aa = abs(mod(xx, 0.5) * 4.0); float bb = mod(floor(xx / 0.5), 2.0); float yy = (1.0 - bb) * aa + bb * (2.0 - aa); float kk = 2.0 * period; float dw = uScratchWidth / max(uResolution.x, 1.0) * (0.75 + randomSeed); float dh = dw * kk; float tine = yy - (2.0 - dh); if (tine > 0.0) { float scratchSign = sign(uScratch); tine = s * tine / max(period, 0.0001) + uScratch + 0.1; tine = clamp(tine + 1.0, 0.5 + scratchSign * 0.5, 1.5 + scratchSign * 0.5); color.rgb *= tine; } }} if (uNoise > 0.0 && uNoiseSize > 0.0) { vec2 pixelCoord = uv * uResolution; pixelCoord = floor(pixelCoord / uNoiseSize); float filmNoise = fract(sin(dot(pixelCoord * uNoiseSize * randomSeed, vec2(12.9898, 78.233))) * 43758.5453) - 0.5; color.rgb += filmNoise * uNoise; } gl_FragColor = color;
}
