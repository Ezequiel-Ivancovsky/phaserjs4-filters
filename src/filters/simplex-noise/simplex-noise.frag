
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
uniform float uStep;
void main(void) {
  vec2 uv = outTexCoord;
  vec4 color = readInput(uv);
  float n = fract(sin(dot(floor(uv * uResolution * max(uStep, 0.01)), vec2(12.9898,78.233))) * 43758.5453); color.rgb += (n - 0.5) * uStrength; gl_FragColor = color;
}
