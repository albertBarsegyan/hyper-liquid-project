export function formatNumber(
  value: string | undefined,
  decimals: number = 2
): string {
  const num = Number(value);

  if (Number.isNaN(num)) return value ?? '';

  return num.toFixed(decimals);
}
