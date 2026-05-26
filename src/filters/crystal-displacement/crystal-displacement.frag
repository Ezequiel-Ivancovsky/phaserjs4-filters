#pragma phaserTemplate(shaderName)
precision mediump float;

uniform sampler2D uMainSampler;
uniform sampler2D uDisplacementSampler;
uniform sampler2D uCaptureSampler;
uniform vec2 uResolution;
uniform vec4 uScreenRect;
uniform float uDisplacementMode;
uniform float uRefractionStrength;
uniform float uFacetSharpness;
uniform float uFresnelStrength;
uniform float uMagnification;
uniform float uGlassAlpha;
uniform float uHighlight;
uniform float uChromaticAberration;

varying vec2 outTexCoord;

#pragma phaserTemplate(fragmentHeader)

void main(void) {
  vec2 uv = outTexCoord;
  vec4 crystal = texture2D(uMainSampler, uv);
  vec4 map = texture2D(uDisplacementSampler, uv);

  float mask = max(crystal.a, map.a);

  if (mask <= 0.001) {
    discard;
  }

  vec2 safeResolution = max(uResolution, vec2(1.0));
  vec2 localCenter = uv - vec2(0.5);
  float backgroundSampleMask = smoothstep(0.001, 0.02, map.a);
  float facetEdge = clamp(map.r - map.g * 0.35, 0.0, 1.0) * mask * backgroundSampleMask;
  float facetInterior = clamp(map.g + map.a * 0.15, 0.0, 1.0) * mask * backgroundSampleMask;
  float sharpness = max(uFacetSharpness, 0.001);
  float facetWeight = pow(clamp(facetInterior + facetEdge, 0.0, 1.0), sharpness);
  vec2 facetMap = vec2(map.r - map.g, map.g - map.r) * facetWeight;
  vec2 vectorMap = (map.rg - vec2(0.5)) * 2.0 * mask * backgroundSampleMask;
  float vectorMode = step(0.5, uDisplacementMode);
  vec2 signedMap = mix(facetMap, vectorMap, vectorMode);
  vec2 facetOffset = facetMap * vec2(34.0, 18.0);
  vec2 vectorOffset = vectorMap * 96.0;
  vec2 offset = mix(facetOffset, vectorOffset, vectorMode) * uRefractionStrength / safeResolution;
  vec2 magnifiedUv = vec2(0.5) + localCenter * (1.0 - uMagnification * mask);
  vec2 captureUv = (uScreenRect.xy + magnifiedUv * uScreenRect.zw) / safeResolution;

  vec4 refracted = texture2D(uCaptureSampler, clamp(captureUv + offset, vec2(0.0), vec2(1.0)));

  if (uChromaticAberration > 0.0) {
    vec2 chroma = normalize(signedMap + vec2(0.0001)) * uChromaticAberration / safeResolution;
    refracted.r = texture2D(uCaptureSampler, clamp(captureUv + offset + chroma, vec2(0.0), vec2(1.0))).r;
    refracted.b = texture2D(uCaptureSampler, clamp(captureUv + offset - chroma, vec2(0.0), vec2(1.0))).b;
  }

  float radialRim = pow(clamp(length(localCenter) * 1.55, 0.0, 1.0), 3.0) * mask;
  float fresnel = clamp(radialRim * 0.35 + pow(facetEdge, max(0.35, sharpness)) * 0.9, 0.0, 1.0) * uFresnelStrength;
  vec3 glassTint = crystal.rgb * (0.35 + crystal.a * 0.65);
  vec3 highlight = vec3(max(map.r - map.g, 0.0)) * uHighlight + vec3(fresnel);
  vec3 backgroundSource = mix(crystal.rgb, refracted.rgb, backgroundSampleMask);
  vec3 result = mix(backgroundSource, glassTint + highlight, clamp(uGlassAlpha * crystal.a, 0.0, 1.0));

  gl_FragColor = vec4(result, mask);
}
