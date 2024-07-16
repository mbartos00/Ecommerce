export function getStarsArray(): number[] {
  const maxStars = 5;
  return Array(maxStars)
    .fill(0)
    .map((_, i) => (i < maxStars ? i + 1 : 0));
}

export function removeNullishProperties<T extends Record<string, unknown>>(
  obj: T
): T {
  Object.keys(obj).forEach((key: string) => {
    if (obj[key] === null) {
      delete obj[key];
    }
  });

  return obj;
}
export function removeEmptyProperties<T extends Record<string, unknown>>(
  obj: T
): T {
  Object.keys(obj).forEach((key: string) => {
    if (obj[key] === null) {
      delete obj[key];
    }
    if (typeof obj[key] === 'string' && (obj[key] as string).length === 0) {
      delete obj[key];
    }
  });

  return obj;
}
