/** @jsxImportSource @emotion/react */
import React from 'react';
import normalizeDataPoints from '../../utils/normalize-data-points';
import type { LabeledXPoint } from '../../types/graph-types';
import { useTheme } from '@mui/material';

interface XAxisProps {
  data: LabeledXPoint[];
  width: number;
  xRange?: [number, number]; // [minY, maxY] y-axis range to be used, instead of normalized
  labelFrequency?: number;   // How often tick labels should show. Every nth label will show. 5 means every 5th tick will be labeled
  style?: React.CSSProperties;
}

const XAxis: React.FC<XAxisProps> = ({
  data, width, xRange, labelFrequency = 1, style
}) => {
  const theme = useTheme();

  const svgHeight = 40;
  const widthOffset = 25;
  const normalizedPoints = normalizeDataPoints(data, width, svgHeight, undefined, xRange);

  const ticks = normalizedPoints.map((point) => point.x);

  return (
    <div style={{ ...style, marginLeft: `-${widthOffset}px` }}>
      <svg width={width + (widthOffset*2)} height={svgHeight}>
        <g>
          {/* Tick Marks */}
          {ticks.map((tickX, index) => (
            <line
              key={index}
              x1={tickX + widthOffset}
              x2={tickX + widthOffset}
              y1={7}
              y2={svgHeight - 23}
              stroke={index % labelFrequency == 0 ? theme.palette.text.primary : theme.palette.text.secondary}
              strokeWidth="1.5"
            />
          ))}

          {/* Labels*/}
          {ticks.map((tickX, index) => (
            index % labelFrequency == 0 &&
              <text
                key={index}
                x={tickX + widthOffset}
                y={svgHeight - 5}
                textAnchor="middle"
                fontSize="12"
                fill={theme.palette.text.primary}
              >
                {data[index].xLabel}
              </text>

          ))}
        </g>
      </svg>
    </div>
  );
};

export default XAxis;
