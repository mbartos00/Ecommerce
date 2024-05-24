export function getStarsArray(): number[] {
  const maxStars = 5;
  return Array(maxStars)
    .fill(0)
    .map((_, i) => (i < maxStars ? i + 1 : 0));
}
