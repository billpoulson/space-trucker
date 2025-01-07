export function calculatePercent(
  progress: number,
  total: number
) {
  return Math.min(Math.max(Math.floor((progress / total) * 100), 0), 100);
}
