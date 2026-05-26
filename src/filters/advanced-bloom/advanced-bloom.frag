
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

uniform float uThreshold;
uniform float uBloomScale;
uniform float uBrightness;
uniform float uBlur;
uniform float uQuality;
void main(void) {
  vec2 uv = outTexCoord;
  vec4 color = readInput(uv);
  float b = smoothstep(uThreshold, 1.0, luma(color.rgb)); vec3 glow = vec3(0.0); for (int x = -4; x <= 4; x++) { for (int y = -4; y <= 4; y++) { vec2 o = vec2(float(x), float(y)) * uBlur / max(uResolution, vec2(1.0)); glow += readInput(uv + o).rgb; }} glow /= 81.0; color.rgb = color.rgb * uBrightness + glow * b * uBloomScale; gl_FragColor = color;
}
