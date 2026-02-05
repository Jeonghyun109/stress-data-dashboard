export const getTopNByValue = <T>(
  data: T[],
  n: number,
  getValue: (item: T) => number,
  thresholdScale = 0.85
): T[] => {
  const sortedData = [...data].sort((a, b) => getValue(b) - getValue(a));
  const nthScore = getValue(sortedData[n - 1] ?? sortedData[0]) || 0;

  return sortedData.filter((item, index) => {
    if (index < n) return true;
    return Math.abs(getValue(item) / (nthScore || 1)) >= thresholdScale * index / n;
  });
};
