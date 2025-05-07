import type { Point } from "../types/graph-types";

/**
 * Normalizes the data points to fit within the specified graph dimensions.
 *
 * @param points - Array of data points to normalize. Each point has an `x` and `y` coordinate.
 * @param graphWidth - The width of the graph in pixels
 * @param graphHeight - The height of the graph in pixels
 * @param yRange - [minY, maxY] y-axis range to be used, instead of normalized
 * @param xRange - [minY, maxY] y-axis range to be used, instead of normalized
 *
 * @returns A new array of data points where the `x` and `y` values have been normalized based on the provided graph dimensions and ranges.
 */
const normalizeDataPoints = (
  points: Point[],
  graphWidth: number,
  graphHeight: number,
  yRange?: [number, number],
  xRange?: [number, number],
): Point[] => {

  let minY, maxY: number;
  let minX, maxX: number;

  if (yRange) {
    [minY, maxY] = yRange;
  } else {
    const yValues = points.map(p => p.y);
    minY = Math.min(...yValues);
    maxY = Math.max(...yValues);
  }

  if (xRange) {
    [minX, maxX] = xRange;

  } else {
    const xValues = points.map(p => p.x);
    minX = Math.min(...xValues);
    maxX = Math.max(...xValues);
  }

  const ySpan = maxY - minY || 1;
  const xSpan = maxX - minX || 1;
  const yShift = 2;

  return points.map(p => ({
    x: ((p.x - minX) / xSpan) * graphWidth,
    y: ((1 - (p.y - minY) / ySpan) * graphHeight) + yShift,
  }));
}

export default normalizeDataPoints;