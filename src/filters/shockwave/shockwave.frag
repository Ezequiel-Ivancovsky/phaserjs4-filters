
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
uniform float uCenterX;
uniform float uCenterY;
uniform float uSpeed;
uniform float uAmplitude;
uniform float uWavelength;
uniform float uBrightness;
uniform float uRadius;
void main(void) {
  vec2 uv = outTexCoord;
  vec4 color = readInput(uv);
  const float PI = 3.14159; vec2 safeResolution = max(uResolution, vec2(1.0)); vec2 centerUv = vec2(uCenterX, uCenterY); float halfWavelength = uWavelength * 0.5 / safeResolution.x; float maxRadius = uRadius / safeResolution.x; float currentRadius = uTime * uSpeed / safeResolution.x; float fade = 1.0; if (maxRadius > 0.0) { if (currentRadius > maxRadius) { gl_FragColor = color; return; } fade = 1.0 - pow(currentRadius / maxRadius, 2.0); } vec2 dir = uv - centerUv; dir.y *= safeResolution.y / safeResolution.x; float dist = length(dir); if (dist <= 0.0 || dist < currentRadius - halfWavelength || dist > currentRadius + halfWavelength) { gl_FragColor = color; return; } vec2 diffUv = normalize(dir); float diff = (dist - currentRadius) / max(halfWavelength, 0.00001); float p = 1.0 - pow(abs(diff), 2.0); float powDiff = 1.25 * sin(diff * PI) * p * (uAmplitude * fade); vec2 coord = uv + diffUv * powDiff / safeResolution; vec2 clampedCoord = clamp(coord, vec2(0.0), vec2(1.0)); vec4 waveColor = readInput(clampedCoord); if (coord != clampedCoord) { waveColor *= max(0.0, 1.0 - length(coord - clampedCoord)); } waveColor.rgb *= 1.0 + (uBrightness - 1.0) * p * fade; gl_FragColor = waveColor;
}
