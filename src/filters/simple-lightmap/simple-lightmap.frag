
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

uniform float uColorR;
uniform float uColorG;
uniform float uColorB;
uniform float uAlpha;
void main(void) {
  vec2 uv = outTexCoord;
  vec4 color = readInput(uv);
  vec2 q = uv - 0.5; float light = smoothstep(0.8, 0.0, length(q)); color.rgb *= mix(vec3(1.0), vec3(uColorR, uColorG, uColorB) * (1.0 + light), uAlpha); gl_FragColor = color;
}
