
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

uniform float uCurvature;
uniform float uLineWidth;
uniform float uNoise;
uniform float uVignetting;
void main(void) {
  vec2 uv = outTexCoord;
  vec4 color = readInput(uv);
  vec2 q = uv * 2.0 - 1.0; vec2 curved = uv + q * dot(q, q) * 0.03 * uCurvature; color = readInput(curved); float scan = 0.85 + 0.15 * sin(uv.y * uResolution.y * max(uLineWidth, 1.0)); float vig = smoothstep(1.2, uVignetting, length(q)); color.rgb *= scan * vig; color.rgb += fract(sin(dot(uv * uTime, vec2(12.9898,78.233))) * 43758.5453) * uNoise * 0.08; gl_FragColor = color;
}
