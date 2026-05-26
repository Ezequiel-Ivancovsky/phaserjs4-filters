
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

uniform float uMix;
uniform float uNearest;
void main(void) {
  vec2 uv = outTexCoord;
  vec4 color = readInput(uv);
  float y = luma(color.rgb); vec3 mapped = vec3(smoothstep(0.0, 1.0, y), y * y, 1.0 - y); color.rgb = mix(color.rgb, mapped, uMix); gl_FragColor = color;
}
