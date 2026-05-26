
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
void main(void) {
  vec2 uv = outTexCoord;
  vec4 color = readInput(uv);
  vec3 sum = vec3(0.0); for (int i = -4; i <= 4; i++) { vec2 o = vec2(float(i)) * uStrength / max(uResolution, vec2(1.0)); sum += readInput(uv + o).rgb; } color.rgb = sum / 9.0; gl_FragColor = color;
}
