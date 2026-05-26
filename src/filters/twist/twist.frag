
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

uniform float uRadius;
uniform float uAngle;
uniform float uOffsetX;
uniform float uOffsetY;
void main(void) {
  vec2 uv = outTexCoord;
  vec4 color = readInput(uv);
  vec2 c = vec2(uOffsetX, uOffsetY); vec2 d = uv - c; float dist = length(d * uResolution); float pct = clamp(1.0 - dist / max(uRadius, 1.0), 0.0, 1.0); float a = pct * pct * uAngle; vec2 r = vec2(d.x*cos(a)-d.y*sin(a), d.x*sin(a)+d.y*cos(a)); gl_FragColor = readInput(c + r);
}
