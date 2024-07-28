export const isValidFein = (fein: string): boolean => {
  const feinRegex = /^\d{9}$/;
  return feinRegex.test(fein);
};
