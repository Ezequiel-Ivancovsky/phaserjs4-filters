const toFloat = (value: unknown, fallback = 0): number =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback;

export const hexToRgb = (value: unknown): [number, number, number] => {
  if (Array.isArray(value)) {
    return [
      toFloat(value[0], 1),
      toFloat(value[1], 1),
      toFloat(value[2], 1),
    ];
  }

  let hex = typeof value === 'number' ? value : 0xffffff;

  if (typeof value === 'string') {
    hex = Number.parseInt(value.replace('#', ''), 16);
  }

  return [
    ((hex >> 16) & 255) / 255,
    ((hex >> 8) & 255) / 255,
    (hex & 255) / 255,
  ];
};

export const normalizeColor = (value: unknown): number => {
  if (typeof value === 'number') {
    return value;
  }

  if (typeof value === 'string') {
    return Number.parseInt(value.replace('#', ''), 16);
  }

  return 0xffffff;
};
