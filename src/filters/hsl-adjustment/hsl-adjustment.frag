
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

uniform float uHue;
uniform float uSaturation;
uniform float uLightness;
uniform float uColorizeR;
uniform float uColorizeG;
uniform float uColorizeB;
void main(void) {
  vec2 uv = outTexCoord;
  vec4 color = readInput(uv);
  float a = radians(uHue); mat3 rot = mat3(0.213 + cos(a)*0.787 - sin(a)*0.213, 0.715 - cos(a)*0.715 - sin(a)*0.715, 0.072 - cos(a)*0.072 + sin(a)*0.928, 0.213 - cos(a)*0.213 + sin(a)*0.143, 0.715 + cos(a)*0.285 + sin(a)*0.140, 0.072 - cos(a)*0.072 - sin(a)*0.283, 0.213 - cos(a)*0.213 - sin(a)*0.787, 0.715 - cos(a)*0.715 + sin(a)*0.715, 0.072 + cos(a)*0.928 + sin(a)*0.072); color.rgb = rot * color.rgb; color.rgb = mix(vec3(luma(color.rgb)), color.rgb, uSaturation) + uLightness; gl_FragColor = color;
}
