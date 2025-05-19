export const assignHrColor = (index: number, total: number): string => {
    const topThreshold = Math.floor(total / 3);
    const middleThreshold = Math.floor((2 * total) / 3);
  
    if (index < topThreshold) {
      return "green";
    } else if (index < middleThreshold) {
      return "orange";
    } else {
      return "red";
    }
  };
