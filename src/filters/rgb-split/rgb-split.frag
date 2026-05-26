
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

uniform float uRedX;
uniform float uRedY;
uniform float uGreenX;
uniform float uGreenY;
uniform float uBlueX;
uniform float uBlueY;
void main(void) {
  vec2 uv = outTexCoord;
  vec4 color = readInput(uv);
  vec2 r = vec2(uRedX, uRedY) / max(uResolution, vec2(1.0)); vec2 g = vec2(uGreenX, uGreenY) / max(uResolution, vec2(1.0)); vec2 b = vec2(uBlueX, uBlueY) / max(uResolution, vec2(1.0)); gl_FragColor = vec4(readInput(uv+r).r, readInput(uv+g).g, readInput(uv+b).b, color.a);
}
