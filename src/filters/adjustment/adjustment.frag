
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

uniform float uGamma;
uniform float uContrast;
uniform float uSaturation;
uniform float uBrightness;
uniform float uRed;
uniform float uGreen;
uniform float uBlue;
uniform float uAlpha;
void main(void) {
  vec2 uv = outTexCoord;
  vec4 color = readInput(uv);
  color.rgb = pow(max(color.rgb, vec3(0.0)), vec3(1.0 / max(uGamma, 0.0001))); float gray = luma(color.rgb); color.rgb = mix(vec3(gray), color.rgb, uSaturation); color.rgb = ((color.rgb - 0.5) * uContrast + 0.5) * vec3(uRed, uGreen, uBlue) * uBrightness; color.a *= uAlpha; gl_FragColor = color;
}
