
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

uniform float uEpsilon;
uniform float uOriginalColorR;
uniform float uOriginalColorG;
uniform float uOriginalColorB;
uniform float uTargetColorR;
uniform float uTargetColorG;
uniform float uTargetColorB;
void main(void) {
  vec2 uv = outTexCoord;
  vec4 color = readInput(uv);
  vec3 orig = vec3(uOriginalColorR, uOriginalColorG, uOriginalColorB); vec3 next = vec3(uTargetColorR, uTargetColorG, uTargetColorB); float m = 1.0 - smoothstep(0.0, max(uEpsilon, 0.0001), distance(color.rgb, orig)); color.rgb = mix(color.rgb, next, m); gl_FragColor = color;
}
