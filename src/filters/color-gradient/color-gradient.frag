
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

uniform float uType;
uniform float uAlpha;
uniform float uAngle;
uniform float uMaxColors;
uniform float uReplace;
uniform float uStopCount;
uniform float uStop0R;
uniform float uStop0G;
uniform float uStop0B;
uniform float uStop0Offset;
uniform float uStop0Alpha;
uniform float uStop1R;
uniform float uStop1G;
uniform float uStop1B;
uniform float uStop1Offset;
uniform float uStop1Alpha;
uniform float uStop2R;
uniform float uStop2G;
uniform float uStop2B;
uniform float uStop2Offset;
uniform float uStop2Alpha;
uniform float uStop3R;
uniform float uStop3G;
uniform float uStop3B;
uniform float uStop3Offset;
uniform float uStop3Alpha;
uniform float uStop4R;
uniform float uStop4G;
uniform float uStop4B;
uniform float uStop4Offset;
uniform float uStop4Alpha;
uniform float uStop5R;
uniform float uStop5G;
uniform float uStop5B;
uniform float uStop5Offset;
uniform float uStop5Alpha;
uniform float uStop6R;
uniform float uStop6G;
uniform float uStop6B;
uniform float uStop6Offset;
uniform float uStop6Alpha;
uniform float uStop7R;
uniform float uStop7G;
uniform float uStop7B;
uniform float uStop7Offset;
uniform float uStop7Alpha;
uniform float uStop8R;
uniform float uStop8G;
uniform float uStop8B;
uniform float uStop8Offset;
uniform float uStop8Alpha;
uniform float uStop9R;
uniform float uStop9G;
uniform float uStop9B;
uniform float uStop9Offset;
uniform float uStop9Alpha;
uniform float uStop10R;
uniform float uStop10G;
uniform float uStop10B;
uniform float uStop10Offset;
uniform float uStop10Alpha;
uniform float uStop11R;
uniform float uStop11G;
uniform float uStop11B;
uniform float uStop11Offset;
uniform float uStop11Alpha;
uniform float uStop12R;
uniform float uStop12G;
uniform float uStop12B;
uniform float uStop12Offset;
uniform float uStop12Alpha;
uniform float uStop13R;
uniform float uStop13G;
uniform float uStop13B;
uniform float uStop13Offset;
uniform float uStop13Alpha;
uniform float uStop14R;
uniform float uStop14G;
uniform float uStop14B;
uniform float uStop14Offset;
uniform float uStop14Alpha;
uniform float uStop15R;
uniform float uStop15G;
uniform float uStop15B;
uniform float uStop15Offset;
uniform float uStop15Alpha;
void main(void) {
  vec2 uv = outTexCoord;
  vec4 color = readInput(uv);
  const float PI2 = 6.2831853076; vec2 centered = uv - vec2(0.5); float position = uv.y; if (uType < 0.5) { float a = radians(uAngle - 90.0); vec2 d = vec2(cos(a), sin(a)); position = clamp(dot(centered, d) + 0.5, 0.0, 1.0); } else if (uType < 1.5) { position = clamp(distance(uv, vec2(0.5)) * 2.0, 0.0, 1.0); } else { position = mod(atan(-centered.y, centered.x) + radians(uAngle), PI2) / PI2; } if (uMaxColors > 0.0) { float stepSize = 1.0 / uMaxColors; position = stepSize * (floor(position / stepSize) + 0.5); } float lastOffset = uStop0Offset; if (uStopCount > 1.5) lastOffset = uStop1Offset; if (uStopCount > 2.5) lastOffset = uStop2Offset; if (uStopCount > 3.5) lastOffset = uStop3Offset; if (uStopCount > 4.5) lastOffset = uStop4Offset; if (uStopCount > 5.5) lastOffset = uStop5Offset; if (uStopCount > 6.5) lastOffset = uStop6Offset; if (uStopCount > 7.5) lastOffset = uStop7Offset; if (uStopCount > 8.5) lastOffset = uStop8Offset; if (uStopCount > 9.5) lastOffset = uStop9Offset; if (uStopCount > 10.5) lastOffset = uStop10Offset; if (uStopCount > 11.5) lastOffset = uStop11Offset; if (uStopCount > 12.5) lastOffset = uStop12Offset; if (uStopCount > 13.5) lastOffset = uStop13Offset; if (uStopCount > 14.5) lastOffset = uStop14Offset; if (uStopCount > 15.5) lastOffset = uStop15Offset; if (position < uStop0Offset || position > lastOffset) { gl_FragColor = color; } else { vec4 fromColor = vec4(vec3(uStop0R, uStop0G, uStop0B) * uStop0Alpha, uStop0Alpha); vec4 toColor = vec4(vec3(uStop1R, uStop1G, uStop1B) * uStop1Alpha, uStop1Alpha); float fromOffset = uStop0Offset; float toOffset = uStop1Offset; if (uStopCount > 2.5 && position >= uStop1Offset && position <= uStop2Offset) { fromColor = vec4(vec3(uStop1R, uStop1G, uStop1B) * uStop1Alpha, uStop1Alpha); toColor = vec4(vec3(uStop2R, uStop2G, uStop2B) * uStop2Alpha, uStop2Alpha); fromOffset = uStop1Offset; toOffset = uStop2Offset; } if (uStopCount > 3.5 && position >= uStop2Offset && position <= uStop3Offset) { fromColor = vec4(vec3(uStop2R, uStop2G, uStop2B) * uStop2Alpha, uStop2Alpha); toColor = vec4(vec3(uStop3R, uStop3G, uStop3B) * uStop3Alpha, uStop3Alpha); fromOffset = uStop2Offset; toOffset = uStop3Offset; } if (uStopCount > 4.5 && position >= uStop3Offset && position <= uStop4Offset) { fromColor = vec4(vec3(uStop3R, uStop3G, uStop3B) * uStop3Alpha, uStop3Alpha); toColor = vec4(vec3(uStop4R, uStop4G, uStop4B) * uStop4Alpha, uStop4Alpha); fromOffset = uStop3Offset; toOffset = uStop4Offset; } if (uStopCount > 5.5 && position >= uStop4Offset && position <= uStop5Offset) { fromColor = vec4(vec3(uStop4R, uStop4G, uStop4B) * uStop4Alpha, uStop4Alpha); toColor = vec4(vec3(uStop5R, uStop5G, uStop5B) * uStop5Alpha, uStop5Alpha); fromOffset = uStop4Offset; toOffset = uStop5Offset; } if (uStopCount > 6.5 && position >= uStop5Offset && position <= uStop6Offset) { fromColor = vec4(vec3(uStop5R, uStop5G, uStop5B) * uStop5Alpha, uStop5Alpha); toColor = vec4(vec3(uStop6R, uStop6G, uStop6B) * uStop6Alpha, uStop6Alpha); fromOffset = uStop5Offset; toOffset = uStop6Offset; } if (uStopCount > 7.5 && position >= uStop6Offset && position <= uStop7Offset) { fromColor = vec4(vec3(uStop6R, uStop6G, uStop6B) * uStop6Alpha, uStop6Alpha); toColor = vec4(vec3(uStop7R, uStop7G, uStop7B) * uStop7Alpha, uStop7Alpha); fromOffset = uStop6Offset; toOffset = uStop7Offset; } if (uStopCount > 8.5 && position >= uStop7Offset && position <= uStop8Offset) { fromColor = vec4(vec3(uStop7R, uStop7G, uStop7B) * uStop7Alpha, uStop7Alpha); toColor = vec4(vec3(uStop8R, uStop8G, uStop8B) * uStop8Alpha, uStop8Alpha); fromOffset = uStop7Offset; toOffset = uStop8Offset; } if (uStopCount > 9.5 && position >= uStop8Offset && position <= uStop9Offset) { fromColor = vec4(vec3(uStop8R, uStop8G, uStop8B) * uStop8Alpha, uStop8Alpha); toColor = vec4(vec3(uStop9R, uStop9G, uStop9B) * uStop9Alpha, uStop9Alpha); fromOffset = uStop8Offset; toOffset = uStop9Offset; } if (uStopCount > 10.5 && position >= uStop9Offset && position <= uStop10Offset) { fromColor = vec4(vec3(uStop9R, uStop9G, uStop9B) * uStop9Alpha, uStop9Alpha); toColor = vec4(vec3(uStop10R, uStop10G, uStop10B) * uStop10Alpha, uStop10Alpha); fromOffset = uStop9Offset; toOffset = uStop10Offset; } if (uStopCount > 11.5 && position >= uStop10Offset && position <= uStop11Offset) { fromColor = vec4(vec3(uStop10R, uStop10G, uStop10B) * uStop10Alpha, uStop10Alpha); toColor = vec4(vec3(uStop11R, uStop11G, uStop11B) * uStop11Alpha, uStop11Alpha); fromOffset = uStop10Offset; toOffset = uStop11Offset; } if (uStopCount > 12.5 && position >= uStop11Offset && position <= uStop12Offset) { fromColor = vec4(vec3(uStop11R, uStop11G, uStop11B) * uStop11Alpha, uStop11Alpha); toColor = vec4(vec3(uStop12R, uStop12G, uStop12B) * uStop12Alpha, uStop12Alpha); fromOffset = uStop11Offset; toOffset = uStop12Offset; } if (uStopCount > 13.5 && position >= uStop12Offset && position <= uStop13Offset) { fromColor = vec4(vec3(uStop12R, uStop12G, uStop12B) * uStop12Alpha, uStop12Alpha); toColor = vec4(vec3(uStop13R, uStop13G, uStop13B) * uStop13Alpha, uStop13Alpha); fromOffset = uStop12Offset; toOffset = uStop13Offset; } if (uStopCount > 14.5 && position >= uStop13Offset && position <= uStop14Offset) { fromColor = vec4(vec3(uStop13R, uStop13G, uStop13B) * uStop13Alpha, uStop13Alpha); toColor = vec4(vec3(uStop14R, uStop14G, uStop14B) * uStop14Alpha, uStop14Alpha); fromOffset = uStop13Offset; toOffset = uStop14Offset; } if (uStopCount > 15.5 && position >= uStop14Offset && position <= uStop15Offset) { fromColor = vec4(vec3(uStop14R, uStop14G, uStop14B) * uStop14Alpha, uStop14Alpha); toColor = vec4(vec3(uStop15R, uStop15G, uStop15B) * uStop15Alpha, uStop15Alpha); fromOffset = uStop14Offset; toOffset = uStop15Offset; } float pct = clamp((position - fromOffset) / max(toOffset - fromOffset, 0.0001), 0.0, 1.0); vec4 gradient = mix(fromColor, toColor, pct) * uAlpha * color.a; gl_FragColor = uReplace > 0.5 ? gradient : gradient + color * (1.0 - gradient.a); }
}
