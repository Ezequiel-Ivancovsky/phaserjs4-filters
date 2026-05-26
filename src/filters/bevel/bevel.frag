
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

uniform float uRotation;
uniform float uThickness;
uniform float uLightColorR;
uniform float uLightColorG;
uniform float uLightColorB;
uniform float uLightAlpha;
uniform float uShadowColorR;
uniform float uShadowColorG;
uniform float uShadowColorB;
uniform float uShadowAlpha;
void main(void) {
  vec2 uv = outTexCoord;
  vec4 color = readInput(uv);
  vec2 transform = vec2(cos(radians(uRotation)), sin(radians(uRotation))) * uThickness / max(uResolution, vec2(1.0)); vec4 base = readInput(uv); float light = readInput(uv - transform).a; float shadow = readInput(uv + transform).a; vec3 lightColor = vec3(uLightColorR, uLightColorG, uLightColorB); vec3 shadowColor = vec3(uShadowColorR, uShadowColorG, uShadowColorB); base.rgb = mix(base.rgb, lightColor, clamp((base.a - light) * uLightAlpha, 0.0, 1.0)); base.rgb = mix(base.rgb, shadowColor, clamp((base.a - shadow) * uShadowAlpha, 0.0, 1.0)); gl_FragColor = vec4(base.rgb, base.a);
}
