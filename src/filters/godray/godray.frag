
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

uniform float uAnimating;
uniform float uGain;
uniform float uLacunarity;
uniform float uAlpha;
uniform float uParallel;
uniform float uAngle;
uniform float uCenterX;
uniform float uCenterY;
float godrayHash(vec3 p) {
  p = fract(p * 0.3183099 + vec3(0.1, 0.2, 0.3));
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}
float godrayNoise(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float n000 = godrayHash(i + vec3(0.0, 0.0, 0.0));
  float n100 = godrayHash(i + vec3(1.0, 0.0, 0.0));
  float n010 = godrayHash(i + vec3(0.0, 1.0, 0.0));
  float n110 = godrayHash(i + vec3(1.0, 1.0, 0.0));
  float n001 = godrayHash(i + vec3(0.0, 0.0, 1.0));
  float n101 = godrayHash(i + vec3(1.0, 0.0, 1.0));
  float n011 = godrayHash(i + vec3(0.0, 1.0, 1.0));
  float n111 = godrayHash(i + vec3(1.0, 1.0, 1.0));
  float nx00 = mix(n000, n100, f.x);
  float nx10 = mix(n010, n110, f.x);
  float nx01 = mix(n001, n101, f.x);
  float nx11 = mix(n011, n111, f.x);
  float nxy0 = mix(nx00, nx10, f.y);
  float nxy1 = mix(nx01, nx11, f.y);
  return mix(nxy0, nxy1, f.z);
}
float godrayTurb(vec3 p, float lacunarity, float gain) {
  float sum = 0.0;
  float scale = 1.0;
  float amplitude = 1.0;
  for (int i = 0; i < 6; i++) {
    sum += amplitude * (godrayNoise(p * scale) * 2.0 - 1.0);
    scale *= lacunarity;
    amplitude *= gain;
  }
  return abs(sum);
}
void main(void) {
  vec2 uv = outTexCoord;
  vec4 color = readInput(uv);
  vec2 safeResolution = max(uResolution, vec2(1.0)); float aspect = safeResolution.y / safeResolution.x; vec2 coord = vec2(uv.x, 1.0 - uv.y); float d; if (uParallel > 0.5) { float radiansAngle = radians(uAngle); float lightX = cos(radiansAngle); float lightY = sin(radiansAngle); d = lightX * coord.x + lightY * coord.y * aspect; } else { float dx = coord.x - uCenterX; float dy = (coord.y - uCenterY) * aspect; float dis = sqrt(dx * dx + dy * dy) + 0.00001; d = dy / dis; } vec3 dir = vec3(d, d, 0.0); float noise = godrayTurb(dir + vec3(uTime, 0.0, 62.1 + uTime) * 0.05, max(uLacunarity, 0.0001), uGain); noise = mix(noise, 0.0, 0.3); vec4 mist = vec4(vec3(noise), 1.0) * (1.0 - coord.y); mist *= uAlpha; gl_FragColor = color + mist;
}
