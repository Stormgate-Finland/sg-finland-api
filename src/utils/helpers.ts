export const chunk = (arr: any[], chunkSize = 1, cache = []) => {
  const tmp = [...arr];
  if (chunkSize <= 0) return cache;
  while (tmp.length) cache.push(tmp.splice(0, chunkSize));
  return cache;
};

export const safelyCompare = (a: string, b: string): boolean => {
  if (a.length !== b.length) {
    return false;
  }

  const encoder = new TextEncoder();
  const aByte = encoder.encode(a);
  const bByte = encoder.encode(b);

  if (aByte.byteLength !== bByte.byteLength) {
    // Strings must be the same length in order to compare
    // with crypto.subtle.timingSafeEqual
    return false;
  }

  return crypto.subtle.timingSafeEqual(aByte, bByte);
};
