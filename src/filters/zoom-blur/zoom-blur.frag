
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
uniform float uCenterX;
uniform float uCenterY;
uniform float uInnerRadius;
uniform float uRadius;
void main(void) {
  vec2 uv = outTexCoord;
  vec4 color = readInput(uv);
  vec2 c = vec2(uCenterX, uCenterY); vec4 sum = vec4(0.0); for (int i=0; i<9; i++) { float t = float(i) / 8.0; sum += readInput(mix(uv, c, t * uStrength)); } gl_FragColor = sum / 9.0;
}
