export const sgwConfig = {
  apiUrl: "https://api.stormgateworld.com/v0",
  defaultCacheTime: 60 * 10, // seconds
};

export const countriesReq = () => {
  const request = new Request(`${sgwConfig.apiUrl}${"/statistics/countries"}`);
  return request;
};
