
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

uniform float uStrength;
uniform float uStrengthX;
uniform float uStrengthY;
uniform float uQuality;
uniform float uKernelSize;
void main(void) {
  vec2 uv = outTexCoord;
  vec4 color = readInput(uv);
  vec2 radius = vec2(max(uStrengthX, uStrength), max(uStrengthY, uStrength)) / max(uResolution, vec2(1.0)); vec3 blur = vec3(0.0); blur += readInput(uv + vec2(-1.0, -1.0) * radius).rgb * 0.0625; blur += readInput(uv + vec2(0.0, -1.0) * radius).rgb * 0.125; blur += readInput(uv + vec2(1.0, -1.0) * radius).rgb * 0.0625; blur += readInput(uv + vec2(-1.0, 0.0) * radius).rgb * 0.125; blur += readInput(uv).rgb * 0.25; blur += readInput(uv + vec2(1.0, 0.0) * radius).rgb * 0.125; blur += readInput(uv + vec2(-1.0, 1.0) * radius).rgb * 0.0625; blur += readInput(uv + vec2(0.0, 1.0) * radius).rgb * 0.125; blur += readInput(uv + vec2(1.0, 1.0) * radius).rgb * 0.0625; vec3 screened = 1.0 - (1.0 - color.rgb) * (1.0 - blur); color.rgb = mix(color.rgb, screened, 0.85); gl_FragColor = color;
}
