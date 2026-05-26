
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
  vec2 p = 1.0 / max(uResolution, vec2(1.0)); vec3 e = readInput(uv - p).rgb - readInput(uv + p).rgb; color.rgb = vec3(0.5) + e * uStrength; gl_FragColor = color;
}
