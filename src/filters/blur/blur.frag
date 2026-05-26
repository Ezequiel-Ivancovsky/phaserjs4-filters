
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

uniform float uBlur;
uniform float uQuality;
void main(void) {
  vec2 uv = outTexCoord;
  vec4 color = readInput(uv);
  float quality = clamp(floor(uQuality + 0.5), 1.0, 10.0); if (uBlur <= 0.0) { gl_FragColor = color; return; } vec4 sum = vec4(0.0); float total = 0.0; vec2 safeResolution = max(uResolution, vec2(1.0)); for (int x = -10; x <= 10; x++) { float fx = float(x); if (abs(fx) <= quality) { float px = fx / quality; float wx = exp(-px * px * 3.5); for (int y = -10; y <= 10; y++) { float fy = float(y); if (abs(fy) <= quality) { float py = fy / quality; float wy = exp(-py * py * 3.5); float weight = wx * wy; vec2 offset = vec2(px, py) * uBlur / safeResolution; vec4 sampleColor = readInput(clamp(uv + offset, vec2(0.0), vec2(1.0))); sampleColor.rgb *= sampleColor.a; sum += sampleColor * weight; total += weight; } }} } vec4 result = sum / max(total, 0.0001); result.rgb /= result.a + 0.00001; gl_FragColor = result;
}
