/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React from 'react';

// TODO: refactor some of this logic to have multi components and base logic (?)
// This components assumes x represents time as 0, 1, 2, 3 etc.
// where 0 = midnight, 1 = 1am, 23 = 11am
type Point = { x: number; y: number };

interface CurvyGraphProps {
  id: string;
  data: Point[];
  gradientstops: [string, string]; // [startColor, endColor]
  width?: number;
  height?: number;

  // line-area is a solid line with a transparent area
  // area is a area graph
  // dashed-line is a dashed line, no area
  type?: 'line-area' | 'area' | 'dashed-line';
}

const CurvyTimeGraph: React.FC<CurvyGraphProps> = ({ id, data, gradientstops, width = 400, height = 200, type }) => {
  const graphId = `curvy-time-graph-${id}`;
  const [startColor, endColor] = gradientstops;
  const svgHeight = height - 20;
  const svgWidth = width;

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

  // Generate Path for Area Graph (Closed Path to Fill Below the Line)
  const generateAreaPath = (d: string, points: Point[]) => {
    // Add a bottom line to close the path and fill only below the line
    const lastPoint = points[points.length - 1];
    const lowestY = svgHeight + 20;

    // The first L draws straight line from last point to bottom of graph
    // The second L draws a horizontal line back to starting x
    // Z close the path
    const bottomLine = `L ${lastPoint.x},${lowestY} L ${points[0].x},${lowestY} Z`;
    return d + ' ' + bottomLine;
  };

  const normalizedPoints = normalizeYDataPoints(data);
  const pathData = generateSmoothPath(normalizedPoints);
  const areaPathData = generateAreaPath(pathData, normalizedPoints);

  // Styles for Line and Area Graphs
  const lineStyle = css`
    stroke: url(#${graphId});
    stroke-width: 4.5;
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
  `;

  // Dashed Line Style
  const dashedLineStyle = css`
    stroke: url(#${graphId});
    stroke-width: 4.5;
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-dasharray: 6, 9; // length of dash, space between dashes
  `;

  // SVG Gradient Definition
  const renderGradient = (isTransparent: boolean) => (
    <defs>
      <linearGradient id={`${graphId}${isTransparent ? "_transparent" : ""}`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor={startColor} stopOpacity={isTransparent ? "0.5" : "1"}/>
        <stop offset="100%" stopColor={endColor} stopOpacity={isTransparent ? "0" : "1"}/>
      </linearGradient>
    </defs>
  );

  return (
    <div>
      <svg width={width} height={height}>
        {renderGradient(false)}

        {type === 'area' && (
          <path d={areaPathData} css={css`
            fill: url(#${graphId});
          `} />
        )}

        {type === 'dashed-line' && (
          <path d={pathData} css={dashedLineStyle} />
        )}

        {type === 'line-area' && (
          <>
            {renderGradient(true)}
            <path d={areaPathData} css={css`
              fill: url(#${graphId}_transparent);
            `}/>
            <path d={pathData} css={lineStyle} />
          </>
        )}
      </svg>
    </div>
  );
};

export default CurvyTimeGraph;
