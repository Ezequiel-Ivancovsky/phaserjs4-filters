
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


void main(void) {
  vec2 uv = outTexCoord;
  vec4 color = readInput(uv);
  float lum = length(color.rgb); vec2 frag = uv * uResolution; vec4 hatch = vec4(1.0); if (lum < 1.00 && mod(frag.x + frag.y, 10.0) < 1.0) { hatch = vec4(0.0, 0.0, 0.0, 1.0); } if (lum < 0.75 && mod(frag.x - frag.y, 10.0) < 1.0) { hatch = vec4(0.0, 0.0, 0.0, 1.0); } if (lum < 0.50 && mod(frag.x + frag.y - 5.0, 10.0) < 1.0) { hatch = vec4(0.0, 0.0, 0.0, 1.0); } if (lum < 0.30 && mod(frag.x - frag.y - 5.0, 10.0) < 1.0) { hatch = vec4(0.0, 0.0, 0.0, 1.0); } gl_FragColor = hatch;
}
