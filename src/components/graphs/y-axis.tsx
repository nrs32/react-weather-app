import React from 'react';
import normalizeDataPoints from '../../utils/normalize-data-points';
import { useTheme } from '@mui/material';
import type { LabeledYPoint } from '../../types/graph-types';

interface YAxisProps {
  height: number;
  graphWidth: number;        // Used to add guidelines behind the chart
  labelFrequency?: number;   // How often tick labels should show. Every nth label will show. 5 means every 5th tick will be labeled
  style?: React.CSSProperties;
  textSpace: number;         // How much space in px the text needs to be able to show
  labeledYPoints: LabeledYPoint[],
}

const YAxis: React.FC<YAxisProps> = ({
  height,
  graphWidth,
  labelFrequency = 5,
  style,
  textSpace,
  labeledYPoints,
}) => {
  const theme = useTheme();

  const textRightPadding = 7;
  const lengthOfTicks = 10;
  const textLeftPadding = 20;
  const endOfTickMark = textSpace + textRightPadding + lengthOfTicks;
  const svgWidth = textLeftPadding + endOfTickMark + graphWidth;

  const heightOffset = 10;

  // TODO: when that stuff is done, we'll clean up everything and then make 2 components, 1 for each chart
  // TODO: where we can share and define logic specific to those charts and clean up App.tsx a ton

  const normalizedPoints = normalizeDataPoints(labeledYPoints, svgWidth, height, undefined, undefined);
  const ticks = normalizedPoints.map((point) => point.y);

  return (
    <div style={{ ...style, marginTop: `-${heightOffset}px` }}>
      <svg width={svgWidth} height={height + (heightOffset * 2)}>
        <g>
          {/* Tick Marks */}
          {ticks.map((tickY, index) => (
            <line
              key={index}
              x1={textSpace + textRightPadding}
              x2={endOfTickMark}
              y1={tickY + heightOffset}
              y2={tickY + heightOffset}
              stroke={index % labelFrequency === 0 ? theme.palette.text.primary : theme.palette.text.secondary}
              strokeWidth="1.5"
            />
          ))}

          {/* Guidelines */}
          {ticks.map((tickY, index) => (
            <line
              key={index}
              x1={endOfTickMark}
              x2={svgWidth - 12}
              y1={tickY + heightOffset}
              y2={tickY + heightOffset}
              stroke={index % labelFrequency === 0 ? theme.palette.text.secondary : 'transparent'}
              strokeWidth="1.5"
            />
          ))}

          {/* Labels */}
          {ticks.map((tickY, index) =>
            index % labelFrequency === 0 ? (
              <text
                key={index}
                x={textSpace}
                y={tickY + heightOffset + 4}
                textAnchor="end"
                fontSize="12"
                fill={theme.palette.text.primary}
              >
                {labeledYPoints[index].yLabel}
              </text>
            ) : null
          )}
        </g>
      </svg>
    </div>
  );
};

export default YAxis;
