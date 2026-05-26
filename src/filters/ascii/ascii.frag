
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

uniform float uSize;
void main(void) {
  vec2 uv = outTexCoord;
  vec4 color = readInput(uv);
  vec2 cell = max(vec2(uSize), vec2(1.0)) / max(uResolution, vec2(1.0)); vec2 snapped = (floor(uv / cell) + 0.5) * cell; float shade = luma(readInput(snapped).rgb); float stripe = step(fract((uv.x + uv.y) * uResolution.x / max(uSize, 1.0)), shade); gl_FragColor = vec4(vec3(stripe * shade), color.a);
}
