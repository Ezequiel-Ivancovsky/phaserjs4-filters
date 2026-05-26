
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

uniform float uAngle;
uniform float uRadius;
uniform float uCenterX;
uniform float uCenterY;
uniform float uKernelSize;
void main(void) {
  vec2 uv = outTexCoord;
  vec4 color = readInput(uv);
  vec2 c = vec2(uCenterX, uCenterY); vec4 sum = vec4(0.0); for (int i=-4; i<=4; i++) { float t = float(i) / 4.0 * radians(uAngle) * 0.02; vec2 d = uv - c; vec2 r = vec2(d.x*cos(t)-d.y*sin(t), d.x*sin(t)+d.y*cos(t)); sum += readInput(c + r); } gl_FragColor = sum / 9.0;
}
