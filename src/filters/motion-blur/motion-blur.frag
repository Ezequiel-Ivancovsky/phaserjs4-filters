
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

uniform float uVelocityX;
uniform float uVelocityY;
uniform float uKernelSize;
uniform float uOffset;
void main(void) {
  vec2 uv = outTexCoord;
  vec4 color = readInput(uv);
  vec2 v = vec2(uVelocityX, uVelocityY) / max(uResolution, vec2(1.0)); vec4 sum = vec4(0.0); for (int i = -4; i <= 4; i++) { sum += readInput(uv + v * (float(i) / 4.0 + uOffset)); } gl_FragColor = sum / 9.0;
}
