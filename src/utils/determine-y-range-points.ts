import type { LabeledYPoint } from "../types/graph-types";

/**
 * Takes a y-axis range and returns a list of totalTicks (number) evenly distributed points
 * E.g. Range: [2, 10]; TotalTicks: 5; List will contain points with Y value of 2, 4, 6, 8, 10
 *
 * @param yRange - [min, max] range to be used
 * @param totalTicks - How many ticks to show
 *
 * @returns An evenly distributed array of LabeledYPoints
 */
const determineYRangePoints = (
  yRange: [number, number],
  totalTicks: number,
  getLabel: (y: number) => string,
): LabeledYPoint[] => {
  const [min, max] = yRange;

  const adjustedMax = (max + 5); // So we go higher than the highest point on the chart curve

  const step = (adjustedMax - min) / totalTicks;
  const labeledYPoints: LabeledYPoint[] = [];
  for (let i = min; i <= adjustedMax; i += step) {
    labeledYPoints.push({
      x: 0,
      y: i,
      yLabel: getLabel(i),
    });
  }

  return labeledYPoints;
}

export default determineYRangePoints;