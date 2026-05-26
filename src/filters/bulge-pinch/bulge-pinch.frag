
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

uniform float uRadius;
uniform float uStrength;
uniform float uCenterX;
uniform float uCenterY;
void main(void) {
  vec2 uv = outTexCoord;
  vec4 color = readInput(uv);
  vec2 center = vec2(uCenterX, uCenterY); vec2 delta = uv - center; float dist = length(delta * uResolution); float pct = clamp(1.0 - dist / max(uRadius, 1.0), 0.0, 1.0); vec2 warped = uv + delta * pct * pct * -uStrength; gl_FragColor = readInput(warped);
}
