import React from 'react';
import normalizeDataPoints from '../../utils/normalize-data-points';
import { useTheme } from '@mui/material';
import { SPACE_BELOW_DATA, type LabeledYPoint, type Point } from '../../types/graph-types';

interface YAxisProps {
  height: number;
  graphWidth: number;        // Used to add guidelines behind the chart
  labelFrequency?: number;   // How often tick labels should show. Every nth label will show. 5 means every 5th tick will be labeled
  style?: React.CSSProperties;
  textSpace: number;         // How much space in px the text needs to be able to show
  labeledYPoints: LabeledYPoint[],
  getLabel: (y: number) => string,
}

interface TicksAndLabels {
  ticks: number[],
  labels: string[],
};

const YAxis: React.FC<YAxisProps> = ({
  height,
  graphWidth,
  labelFrequency = 5,
  style,
  textSpace,
  labeledYPoints,
  getLabel,
}) => {
  const theme = useTheme();

  const textRightPadding = 7;
  const lengthOfTicks = 10;
  const textLeftPadding = 20;
  const endOfTickMark = textSpace + textRightPadding + lengthOfTicks;
  const svgWidth = textLeftPadding + endOfTickMark + graphWidth;

  const heightOffset = 10;

  const normalizedPoints = normalizeDataPoints(labeledYPoints, svgWidth, height - SPACE_BELOW_DATA, undefined, undefined);

  const { labels, ticks } = getLabelsForSpaceBelowData(labeledYPoints, normalizedPoints, height, getLabel);

  const finalTicks = ticks.concat(normalizedPoints.map((point) => point.y));
  const finalLabels = labels.concat(labeledYPoints.map(label => label.yLabel));

  return (
    <div style={{ ...style, marginTop: `-${heightOffset}px` }}>
      <svg width={svgWidth} height={height + (heightOffset * 2)}>
        <g>
          {/* Tick Marks */}
          {finalTicks.map((tickY, index) => (
            <line
              key={`${index}_tick`}
              x1={textSpace + textRightPadding}
              x2={endOfTickMark}
              y1={tickY + heightOffset}
              y2={tickY + heightOffset}
              stroke={index % labelFrequency === 0 ? theme.palette.text.primary : theme.palette.text.secondary}
              strokeWidth="1.5"
            />
          ))}

          {/* Guidelines */}
          {finalTicks.map((tickY, index) => (
            <line
            key={`${index}_guideline`}
              x1={endOfTickMark}
              x2={svgWidth - 12}
              y1={tickY + heightOffset}
              y2={tickY + heightOffset}
              stroke={index % labelFrequency === 0 ? theme.palette.text.secondary : 'transparent'}
              strokeWidth="1.5"
            />
          ))}

          {/* Labels */}
          {finalTicks.map((tickY, index) =>
            index % labelFrequency === 0 ? (
              <text
                key={`${index}_label`}
                x={textSpace}
                y={tickY + heightOffset + 4}
                textAnchor="end"
                fontSize="12"
                fill={theme.palette.text.primary}
              >
                {finalLabels[index]}
              </text>
            ) : null
          )}
        </g>
      </svg>
    </div>
  );
};

/**
 * This method gets tick mark y coordinates, and labels to display on the section of the chart that is below the lowest actual data
 * This is because of our use of SPACE_BELOW_DATA, which lets the charts look more beautiful
 *
 * @returns An object with a list of label string and a list of tick coordinates
 */
const getLabelsForSpaceBelowData = (
  labeledYPoints: LabeledYPoint[],
  normalizedPoints: Point[],
  height: number,
  getLabel: (y: number) => string,
): TicksAndLabels => {
  const result: TicksAndLabels = {
    labels: [],
    ticks: [],
  };

  const lowestYValue: number = labeledYPoints[0].y;
  const stepBetweenOriginalYValues = labeledYPoints[1].y - lowestYValue;

  const lowestPossibleYCoordinate = height;
  const lowestExistingGraphYCoordinate = normalizedPoints[0].y;
  const stepBetweenGraphYCoordinates = lowestExistingGraphYCoordinate - normalizedPoints[1].y;
  const nextLowestGraphYCoordinate = lowestExistingGraphYCoordinate + stepBetweenGraphYCoordinates;

  let labelYValue = lowestYValue;

  for (let graphYCoor = nextLowestGraphYCoordinate; graphYCoor <= lowestPossibleYCoordinate; graphYCoor += stepBetweenGraphYCoordinates) {

    labelYValue -= stepBetweenOriginalYValues;
    result.labels.unshift(getLabel(labelYValue));

    result.ticks.unshift(graphYCoor);
  }

  return result;
}

export default YAxis;
