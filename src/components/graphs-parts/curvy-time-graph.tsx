/** @jsxImportSource @emotion/react */
import { SPACE_BELOW_DATA, type Point } from '../../types/graph-types';
import { css } from '@emotion/react';
import React from 'react';
import normalizeDataPoints from '../../utils/normalize-data-points';

export type GradientDirection = 'v' | 'h'; // vertical or horizontal

export interface CurvyGraphProps {
  id: string;
  data: Point[];
  width: number;
  height: number;
  yRange?: [number, number]; // [minY, maxY] y-axis range to be used, instead of normalized
  xRange?: [number, number]; // [minY, maxY] y-axis range to be used, instead of normalized

  style?: React.CSSProperties;
  gradientstops: [string, string]; // [startColor, endColor]
  gradientDirection?: GradientDirection;

  // line-area is a solid line with a transparent area
  // area is a area graph
  // dashed-line is a dashed line, no area
  type: 'line-area' | 'area' | 'dashed-line';
  showAreaShadow?: boolean;  // show shadow above area curve
}

const CurvyTimeGraph: React.FC<CurvyGraphProps> = ({ id, style, data, gradientstops, gradientDirection = 'v', type, width, height, yRange, xRange, showAreaShadow }) => {
  const graphId = `curvy-time-graph-${id}`;
  const [startColor, endColor] = gradientstops;
  const svgHeight = height - SPACE_BELOW_DATA;
  const svgWidth = width;

  const normalizedPoints = normalizeDataPoints(data, svgWidth, svgHeight, yRange, xRange);
  const pathData = generateSmoothPath(normalizedPoints);
  const areaPathData = generateAreaPath(pathData, normalizedPoints, svgHeight);

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
      <linearGradient
        id={`${graphId}${isTransparent ? "_transparent" : ""}`}
        x1="0%"
        y1="0%"
        x2={gradientDirection === 'h' ? '100%' : '0%'}
        y2={gradientDirection === 'h' ? '0%' : '100%'}
      >
        <stop offset="0%" stopColor={startColor} stopOpacity={isTransparent ? "0.5" : "1"}/>
        <stop offset="100%" stopColor={endColor} stopOpacity={isTransparent ? "0" : "1"}/>
      </linearGradient>
    </defs>
  );

  return (
    <div style={style}>
      <svg width={width} height={height}>
        {renderGradient(false)}

        {type === 'area' && (
          <>
            {showAreaShadow &&
              <defs>
                <filter id="areaShadow" x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow
                    dx="0"
                    dy="-2" // shadow up 2 px
                    stdDeviation="4"  // softness
                    floodColor="rgba(0, 0, 0, 0.15)" />
                </filter>
              </defs>
            }
            <path d={areaPathData} css={css`
              fill: url(#${graphId});
              filter: url(#areaShadow);
            `} />
          </>
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

  // The above map loop will end the curve at the midpoint between the second to last, and last points
  // So here we add to the curve the final segment for the final x, y
  const secondLast = points[points.length - 2];
  const last = points[points.length - 1];
  d.push(`Q ${secondLast.x},${secondLast.y} ${last.x},${last.y}`);

  return d.join(' ');
};

// Generate Path for Area Graph (Closed Path to Fill Below the Line)
const generateAreaPath = (d: string, points: Point[], svgHeight: number) => {
  // Add a bottom line to close the path and fill only below the line
  const lastPoint = points[points.length - 1];
  const lowestY = svgHeight + 20;

  // The first L draws straight line from last point to bottom of graph
  // The second L draws a horizontal line back to starting x
  // Z close the path
  const bottomLine = `L ${lastPoint.x},${lowestY} L ${points[0].x},${lowestY} Z`;
  return d + ' ' + bottomLine;
};

export default CurvyTimeGraph;
