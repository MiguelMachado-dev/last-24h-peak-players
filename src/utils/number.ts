export const formatNumber = (num: number): string => {
  return num
    .toLocaleString("en-US", {
      maximumFractionDigits: 0,
      useGrouping: true,
    })
    .replace(/,/g, ".");
};

export const parseFormattedNumber = (str: string): number => {
  return parseInt(str.replace(/\./g, ""), 10);
};
