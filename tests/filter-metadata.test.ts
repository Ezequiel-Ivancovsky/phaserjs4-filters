import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { hexToRgb, normalizeColor } from '../src/filters/color';

describe('filter metadata', () => {
  it('exports all source filters and demo extras', () => {
    const generated = readFileSync(resolve('src/filters/generated.ts'), 'utf8');

    expect((generated.match(/id: '/g) ?? []).length).toBe(42);
    expect(generated).toContain("id: 'AdjustmentFilter'");
    expect(generated).toContain('"brightness":1');
    expect(generated).toContain("id: 'NoiseFilter'");
    expect(generated).toContain("source: 'demo-extra'");
  });

  it('keeps OldFilm controls aligned with the Pixi demo', () => {
    const generated = readFileSync(resolve('src/filters/generated.ts'), 'utf8');

    expect(generated).toContain('"noiseSize":1');
    expect(generated).toContain('"scratchDensity":0.3');
    expect(generated).toContain('"scratchWidth":1');
    expect(generated).toContain('"vignettingAlpha":1');
    expect(generated).toContain('"vignettingBlur":0.3');
  });

  it('normalizes colors for shader uniforms and GUI controls', () => {
    expect(normalizeColor('#ff0000')).toBe(0xff0000);
    expect(hexToRgb(0x336699)).toEqual([0x33 / 255, 0x66 / 255, 0x99 / 255]);
  });
});
