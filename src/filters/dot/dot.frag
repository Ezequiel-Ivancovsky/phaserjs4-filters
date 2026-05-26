
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

uniform float uScale;
uniform float uAngle;
void main(void) {
  vec2 uv = outTexCoord;
  vec4 color = readInput(uv);
  vec2 p = uv * uResolution / max(uScale, 0.1); float s = sin(uAngle), c = cos(uAngle); p = mat2(c, -s, s, c) * p; float pattern = sin(p.x) * sin(p.y); color.rgb *= 0.8 + 0.2 * pattern; gl_FragColor = color;
}
