
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

uniform float uAmount;
void main(void) {
  vec2 uv = outTexCoord;
  vec4 color = readInput(uv);
  color.rgb = mix(color.rgb, vec3(luma(color.rgb)), uAmount); gl_FragColor = color;
}
