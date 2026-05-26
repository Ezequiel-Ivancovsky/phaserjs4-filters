
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

uniform float uOffsetX;
uniform float uOffsetY;
uniform float uAlpha;
uniform float uColorR;
uniform float uColorG;
uniform float uColorB;
uniform float uBlur;
uniform float uQuality;
uniform float uShadowOnly;
void main(void) {
  vec2 uv = outTexCoord;
  vec4 color = readInput(uv);
  vec2 off = vec2(uOffsetX, uOffsetY) / max(uResolution, vec2(1.0)); vec2 blurStep = vec2(max(uBlur, 0.0) + max(uQuality, 0.0) * 0.25) / max(uResolution, vec2(1.0)); float shadow = 0.0; shadow += readInput(uv - off).a * 0.30; shadow += readInput(uv - off + vec2(blurStep.x, 0.0)).a * 0.10; shadow += readInput(uv - off - vec2(blurStep.x, 0.0)).a * 0.10; shadow += readInput(uv - off + vec2(0.0, blurStep.y)).a * 0.10; shadow += readInput(uv - off - vec2(0.0, blurStep.y)).a * 0.10; shadow += readInput(uv - off + blurStep).a * 0.075; shadow += readInput(uv - off - blurStep).a * 0.075; shadow += readInput(uv - off + vec2(blurStep.x, -blurStep.y)).a * 0.075; shadow += readInput(uv - off + vec2(-blurStep.x, blurStep.y)).a * 0.075; vec4 shadowColor = vec4(vec3(uColorR, uColorG, uColorB), shadow * uAlpha); if (uShadowOnly > 0.5) { gl_FragColor = shadowColor; } else { gl_FragColor = shadowColor * (1.0 - color.a) + color; }
}
