
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

uniform float uBlur;
uniform float uGradientBlur;
uniform float uStartX;
uniform float uStartY;
uniform float uEndX;
uniform float uEndY;
void main(void) {
  vec2 uv = outTexCoord;
  vec4 color = readInput(uv);
  float mask = smoothstep(uStartY, uEndY, uv.y); mask = abs(mask - 0.5) * 2.0; vec2 o = vec2(uBlur * mask) / max(uResolution, vec2(1.0)); gl_FragColor = (readInput(uv) + readInput(uv + o) + readInput(uv - o)) / 3.0;
}
