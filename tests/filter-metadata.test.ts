import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { hexToRgb, normalizeColor } from '../src/filters/color';

describe('filter metadata', () => {
  it('exports all source filters and demo extras', () => {
    const filterDirs = readdirSync(resolve('src/filters'), { withFileTypes: true })
      .filter((entry) => entry.isDirectory());
    const filterSources = filterDirs
      .flatMap((entry) => readdirSync(resolve('src/filters', entry.name))
        .filter((file) => file.endsWith('Filter.ts'))
        .map((file) => readFileSync(resolve('src/filters', entry.name, file), 'utf8')));

    expect(filterSources).toHaveLength(43);
    expect(filterSources.some((source) => source.includes("id: 'AdjustmentFilter'"))).toBe(true);
    expect(filterSources.some((source) => source.includes('"brightness":1'))).toBe(true);
    expect(filterSources.some((source) => source.includes("id: 'NoiseFilter'"))).toBe(true);
    expect(filterSources.some((source) => source.includes("source: 'demo-extra'"))).toBe(true);
    expect(filterSources.some((source) => source.includes("id: 'CrystalDisplacementFilter'"))).toBe(true);
  });

  it('keeps OldFilm controls aligned with the Pixi demo', () => {
    const source = readFileSync(resolve('src/filters/old-film/OldFilmFilter.ts'), 'utf8');

    expect(source).toContain('"noiseSize":1');
    expect(source).toContain('"scratchDensity":0.3');
    expect(source).toContain('"scratchWidth":1');
    expect(source).toContain('"vignettingAlpha":1');
    expect(source).toContain('"vignettingBlur":0.3');
  });

  it('normalizes colors for shader uniforms and GUI controls', () => {
    expect(normalizeColor('#ff0000')).toBe(0xff0000);
    expect(hexToRgb(0x336699)).toEqual([0x33 / 255, 0x66 / 255, 0x99 / 255]);
  });
});
