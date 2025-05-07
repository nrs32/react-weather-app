/** @jsxImportSource @emotion/react */
import { css, useTheme } from '@emotion/react';
import React from 'react';

// This components assumes x represents time as 0, 1, 2, 3 etc.
// where 0 = midnight, 1 = 1am, 23 = 11am
type Point = { x: number; y: number };

interface CurvyGraphProps {
  data: Point[];
  width?: number;
  height?: number;
}

const CurvyTimeGraph: React.FC<CurvyGraphProps> = ({ data, width = 400, height = 200 }) => {
  const theme = useTheme();
  const svgHeight = height - 20;
  const svgWidth = width - 20;

  const generateSmoothPath = (points: Point[]) => {
    const d = points.map((point, i, arr) => {

      // Move to the starting x, y, without drawing a line
      if (i === 0) return `M ${point.x},${point.y}`;

      // Get the previous position
      const prev = arr[i - 1];

      // control points: midpoints between current and previous x,y positions
      const cx = (prev.x + point.x) / 2;
      const cy = (prev.y + point.y) / 2;

      // Quadratic Bézier curve
      // Draws a curve toward x, y with the bend based on the controlPoints
      return `Q ${prev.x},${prev.y} ${cx},${cy}`;
    });
    return d.join(' ');
  };

  function normalizeYDataPoints(points: Point[]): Point[] {
    // map Y values into a consistent visual range
    // so the minimum y maps to the bottom, and the max y maps to the top
    const yValues = points.map(p => p.y);
    const minY = Math.min(...yValues);
    const maxY = Math.max(...yValues);
    const range = maxY - minY || 1; // avoid divide-by-zero
    const yShift = 2; // Shifts all y points down 2 px to prevent clipping

    return points.map(p => ({
      x: (p.x / 24) * svgWidth, // Scale x points
      y: (1 - (p.y - minY) / range) * svgHeight + yShift,
    }));
  }

  const normalizedPoints = normalizeYDataPoints(data);
  const pathData = generateSmoothPath(normalizedPoints);

  const graphLineStyles = css`
    stroke: ${theme.palette.primary.main};
    stroke-width: 3;
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
  `;

  return (
    <div>
      <svg width={width} height={height}>
        <path d={pathData} css={graphLineStyles} />
      </svg>
    </div>
  );
};

export default CurvyTimeGraph;
