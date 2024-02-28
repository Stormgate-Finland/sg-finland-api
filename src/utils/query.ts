export const queryString = (params: Record<string, any>) => {
  return Object.entries(params)
    .map(([key, value]) => {
      if (value === null || value === undefined) return null;
      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    })
    .filter(Boolean)
    .join("&");
};
