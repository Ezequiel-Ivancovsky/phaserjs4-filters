
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

uniform float uStrength;
uniform float uQuality;
uniform float uPixelSizeX;
uniform float uPixelSizeY;
uniform float uClamp;
void main(void) {
  vec2 uv = outTexCoord;
  vec4 color = readInput(uv);
  float quality = clamp(floor(uQuality + 0.5), 1.0, 12.0); vec2 pixelSize = max(vec2(uPixelSizeX, uPixelSizeY), vec2(0.0)); vec4 sum = readInput(uv) * 0.5; float total = 0.5; for (int i = 0; i < 12; i++) { float fi = float(i); if (fi < quality && uStrength > 0.0) { float kernel = ((quality - fi) / quality) * uStrength + 0.5; vec2 offset = kernel * pixelSize / max(uResolution, vec2(1.0)); vec2 uv1 = uv + offset; vec2 uv2 = uv - offset; vec2 uv3 = uv + vec2(offset.x, -offset.y); vec2 uv4 = uv + vec2(-offset.x, offset.y); if (uClamp > 0.5) { uv1 = clamp(uv1, vec2(0.0), vec2(1.0)); uv2 = clamp(uv2, vec2(0.0), vec2(1.0)); uv3 = clamp(uv3, vec2(0.0), vec2(1.0)); uv4 = clamp(uv4, vec2(0.0), vec2(1.0)); } float weight = 1.0 - fi / max(quality, 1.0); sum += (readInput(uv1) + readInput(uv2) + readInput(uv3) + readInput(uv4)) * (0.25 * weight); total += weight; }} gl_FragColor = sum / max(total, 0.0001);
}
