
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
uniform float uGradientBlur;
uniform float uStartX;
uniform float uStartY;
uniform float uEndX;
uniform float uEndY;
void main(void) {
  vec2 uv = outTexCoord;
  vec4 color = readInput(uv);
  vec2 safeResolution = max(uResolution, vec2(1.0)); vec2 start = vec2(uStartX, uStartY) * safeResolution; vec2 end = vec2(uEndX, uEndY) * safeResolution; vec2 axis = end - start; float axisLength = max(length(axis), 0.0001); vec2 lineDir = axis / axisLength; vec2 normal = vec2(-lineDir.y, lineDir.x); float distanceFromLine = abs(dot(uv * safeResolution - start, normal)); float radius = smoothstep(0.0, 1.0, distanceFromLine / max(uGradientBlur, 0.0001)) * uBlur; if (radius < 0.01) { gl_FragColor = color; return; } vec4 sum = vec4(0.0); float total = 0.0; for (int x = -8; x <= 8; x++) { float px = float(x) / 8.0; float wx = 1.0 - abs(px); for (int y = -8; y <= 8; y++) { float py = float(y) / 8.0; float wy = 1.0 - abs(py); float weight = wx * wy; vec2 offset = (lineDir * px + normal * py) * radius / safeResolution; vec4 sampleColor = readInput(clamp(uv + offset, vec2(0.0), vec2(1.0))); sampleColor.rgb *= sampleColor.a; sum += sampleColor * weight; total += weight; }} vec4 result = sum / max(total, 0.0001); result.rgb /= result.a + 0.00001; gl_FragColor = result;
}
