
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
uniform float uMirror;
uniform float uBoundary;
uniform float uAmplitudeStart;
uniform float uAmplitudeEnd;
uniform float uWaveLengthStart;
uniform float uWaveLengthEnd;
uniform float uAlphaStart;
uniform float uAlphaEnd;
void main(void) {
  vec2 uv = outTexCoord;
  vec4 color = readInput(uv);
  vec2 safeResolution = max(uResolution, vec2(1.0)); float visualY = 1.0 - uv.y; if (visualY < uBoundary) { gl_FragColor = color; return; } float k = (visualY - uBoundary) / max(1.0 - uBoundary, 0.0001); float reflectedVisualY = uBoundary + uBoundary - visualY; float y = uMirror > 0.5 ? 1.0 - reflectedVisualY : uv.y; float amplitude = mix(uAmplitudeStart, uAmplitudeEnd, k) / safeResolution.x; float waveLength = mix(uWaveLengthStart, uWaveLengthEnd, k) / safeResolution.y; float alpha = mix(uAlphaStart, uAlphaEnd, k); float x = uv.x + cos(y * 6.28318530718 / max(waveLength, 0.0001) - uTime) * amplitude; vec2 reflectionUv = clamp(vec2(x, y), vec2(0.0), vec2(1.0)); gl_FragColor = readInput(reflectionUv) * alpha;
}
