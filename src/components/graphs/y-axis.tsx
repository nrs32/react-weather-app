import React from 'react';
import normalizeDataPoints from '../../utils/normalize-data-points';
import { useTheme } from '@mui/material';

interface YAxisProps {
  height?: number;
  graphWidth?: number;
  yRange: [number, number];  // [minY, maxY] y-axis range to be used
  labelFrequency?: number;   // How often tick labels should show. Every nth label will show. 5 means every 5th tick will be labeled
  totalTicks?: number;       // How many ticks to show
  style?: React.CSSProperties;
}

const YAxis: React.FC<YAxisProps> = ({
  height = 200,
  graphWidth = 400,
  yRange,
  totalTicks = 25,
  labelFrequency = 5,
  style,
}) => {
  const theme = useTheme();
  const [min, max] = yRange;
  const adjustedMax = (max + 5); // So we go higher than the highest point on the chart curve

  const spaceForLabelsAndTick = 65;
  const svgWidth = spaceForLabelsAndTick + graphWidth;

  const textSpace = 30;
  const textRightPadding = 7;
  const lengthOfTicks = 10;
  const endOfTickMark = textSpace + textRightPadding + lengthOfTicks;

  const heightOffset = 10;

  // TODO: instead of doing this logic here, do it in App.tsx and pass in the labels array
  // TODO: then we can do custom logic for second chart but still use normalize
  // TODO: we'll adjust this to take two lists, labels in one list and points in another
  // TODO: then we can, outside of here, use logic to label ticks as (humidity, temperature) but use the same lines


  // TODO: when that stuff is done, we'll clean up everything and then make 2 components, 1 for each chart
  // TODO: where we can share and define logic specific to those charts and clean up App.tsx a ton
  const step = (adjustedMax - min) / totalTicks;
  const labels: number[] = [];
  for (let i = min; i <= adjustedMax; i += step) {
    labels.push(i);
  }

  const normalizedPoints = normalizeDataPoints(labels.map(tick => ({x: 0, y: tick})), svgWidth, height, yRange, undefined);
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
                {Math.round(labels[index])}
              </text>
            ) : null
          )}
        </g>
      </svg>
    </div>
  );
};

export default YAxis;
