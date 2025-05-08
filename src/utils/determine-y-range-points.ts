import type { LabeledYPoint } from "../types/graph-types";

/**
 * Takes a y-axis range and returns a list of evenly distributed points
 *
 * E.g. Range: [2, 10]; totalDataPoints: 5; List will contain points with Y value of 2, 4, 6, 8, 10
 *
 * NOTE, yAxis adds SPACE_BELOW_CHART meaning the total ticks on a chart will be (totalDataPoints + # of ticks to fill the space below the chart)
 *
 * @param yRange - [min, max] range to be used
 * @param totalDataPoints - How many data points you want back
 *
 * @returns An evenly distributed array of LabeledYPoints
 */
const determineYRangePoints = (
  yRange: [number, number],
  totalDataPoints: number,
  getLabel: (y: number) => string,
): LabeledYPoint[] => {
  const [min, max] = yRange;

  const step = (max - min) / totalDataPoints;
  const labeledYPoints: LabeledYPoint[] = [];

  for (let i = min; labeledYPoints.length < totalDataPoints + 1; i += step) {
    labeledYPoints.push({
      x: 0,
      y: i,
      yLabel: getLabel(i),
    });
  }

  return labeledYPoints;
}

export default determineYRangePoints;