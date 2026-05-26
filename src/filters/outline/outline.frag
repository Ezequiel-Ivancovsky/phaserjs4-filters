
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

uniform float uThickness;
uniform float uColorR;
uniform float uColorG;
uniform float uColorB;
uniform float uAlpha;
void main(void) {
  vec2 uv = outTexCoord;
  vec4 color = readInput(uv);
  float currentInside = step(0.0, uv.x) * step(0.0, uv.y) * step(uv.x, 1.0) * step(uv.y, 1.0); color *= currentInside; float edge = 0.0; vec2 radius = vec2(max(uThickness, 0.0)) / max(uResolution, vec2(1.0)); for (int x=-4; x<=4; x++) { for (int y=-4; y<=4; y++) { vec2 dir = vec2(float(x), float(y)); float dist = length(dir); if (dist > 0.0 && dist <= 4.0) { vec2 sampleUv = uv + normalize(dir) * radius * (dist / 4.0); float sampleInside = step(0.0, sampleUv.x) * step(0.0, sampleUv.y) * step(sampleUv.x, 1.0) * step(sampleUv.y, 1.0); edge = max(edge, readInput(sampleUv).a * sampleInside); } }} vec4 outline = vec4(vec3(uColorR, uColorG, uColorB), edge * uAlpha); gl_FragColor = color + outline * (1.0 - color.a);
}
