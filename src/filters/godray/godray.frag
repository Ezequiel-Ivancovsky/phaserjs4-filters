
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

uniform float uGain;
uniform float uLacunarity;
uniform float uParallel;
uniform float uAngle;
void main(void) {
  vec2 uv = outTexCoord;
  vec4 color = readInput(uv);
  vec2 d = vec2(cos(radians(uAngle)), sin(radians(uAngle))); float rays = pow(max(0.0, sin(dot(uv, d) * 40.0 + uTime * 0.03)), max(uLacunarity, 0.1)); color.rgb += rays * uGain * color.a; gl_FragColor = color;
}
