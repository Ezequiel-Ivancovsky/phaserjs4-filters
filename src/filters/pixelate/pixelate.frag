
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

uniform float uSizeX;
uniform float uSizeY;
void main(void) {
  vec2 uv = outTexCoord;
  vec4 color = readInput(uv);
  vec2 size = max(vec2(uSizeX, uSizeY), vec2(1.0)); vec2 p = size / max(uResolution, vec2(1.0)); gl_FragColor = readInput((floor(uv / p) + 0.5) * p);
}
