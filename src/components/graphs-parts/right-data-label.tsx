import { useTheme } from '@mui/material';
import React from 'react';

import { SPACE_BELOW_DATA, type Point } from '../../types/graph-types';
import normalizeDataPoints from '../../utils/normalize-data-points';

interface RightDataLabelProps {
  data: Point[];
  width: number;
  height: number;
  yRange?: [number, number]; // [minY, maxY] y-axis range to be used, instead of normalized
  xRange?: [number, number]; // [minY, maxY] y-axis range to be used, instead of normalized
  labelColor: string;
  label: string;

  style?: React.CSSProperties;
}

const RightDataLabel: React.FC<RightDataLabelProps> = ({
  data,
  width,
  height,
  yRange,
  xRange,
  labelColor,
  label,
  style,
}) => {
  const theme = useTheme();

  const svgHeight = height - SPACE_BELOW_DATA;

  const normalizedPoints = normalizeDataPoints(data, width, svgHeight, yRange, xRange);
  const lastNormalizedPoint = normalizedPoints[normalizedPoints.length - 1];
  const letterHeight = 14;

  return (
    <div style={{ ...style }}>
      <svg width={width} height={height}>
        <g>
          <text
            x={lastNormalizedPoint.x}
            y={lastNormalizedPoint.y + letterHeight}
            textAnchor="end"
            fontSize={`${letterHeight}`}
            fill={labelColor}
            letterSpacing={theme.palette.text.secondaryLetterSpacing}
            fontWeight={700}
          >
            {label}
          </text>
        </g>
      </svg>
    </div>
  );
};

export default RightDataLabel;
