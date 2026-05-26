
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

uniform float uScaleX;
uniform float uScaleY;
uniform sampler2D uDisplacementSampler;
void main(void) {
  vec2 uv = outTexCoord;
  vec4 color = readInput(uv);
  vec2 map = texture2D(uDisplacementSampler, uv).rg - vec2(0.5); vec2 offset = map * vec2(uScaleX, uScaleY) / max(uResolution, vec2(1.0)); gl_FragColor = readInput(uv + offset);
}
