export const getNumFromPx = (str: string) =>
  parseInt(str.replace(/[^0-9]/g, ""));
