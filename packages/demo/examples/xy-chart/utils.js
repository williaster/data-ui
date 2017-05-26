export function numTicksForHeight(height) {
  if (height <= 300) return 3;
  if (height <= 600) return 5;
  return 10;
}

export function numTicksForWidth(width) {
  if (width <= 300) return 2;
  if (width <= 400) return 5;
  return 10;
}
