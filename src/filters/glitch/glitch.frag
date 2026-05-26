
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

uniform float uSlices;
uniform float uOffset;
uniform float uDirection;
uniform float uFillMode;
uniform float uSeed;
void main(void) {
  vec2 uv = outTexCoord;
  vec4 color = readInput(uv);
  float band = floor(uv.y * max(uSlices, 1.0)); float rnd = fract(sin(band * 12.9898 + uSeed + uTime * 0.01) * 43758.5453); vec2 dir = vec2(cos(radians(uDirection)), sin(radians(uDirection))); vec2 guv = uv + dir * (rnd - 0.5) * uOffset / max(uResolution, vec2(1.0)); gl_FragColor = readInput(guv);
}
