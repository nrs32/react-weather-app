import { useTheme } from '@mui/material/styles';

import type React from 'react';
import type { HourlyWeather } from '../../types/weather-types';
import type { GraphProps, LabeledXPoint, LabeledYPoint, Point } from '../../types/graph-types';
import determineYRangePoints from '../../utils/determine-y-range-points';
import YAxis from '../../components/graphs-parts/y-axis';
import CurvyTimeGraph from '../../components/graphs-parts/curvy-time-graph';
import XAxis from '../../components/graphs-parts/x-axis';
import getTemperatureLabel from '../../utils/get-y-label';
import getHumidityLabel from '../../utils/get-humidity-label';
import RightDataLabel from '../../components/graphs-parts/right-data-label';
import Box from '@mui/material/Box';
import CurvyTimeGraphAnimator from '../../components/graphs-parts/curvy-time-graph-animator';

interface TempVHumidityGraphProps extends GraphProps {
  title: string,
  hourlyWeather: HourlyWeather[],
}

const TempVHumidityGraph: React.FC<TempVHumidityGraphProps> = ({ title, hourlyWeather, graphWidth, graphHeight, chartTop, chartLeft }) => {
  const theme = useTheme();

  const hourlyTemps: LabeledXPoint[] = hourlyWeather.map((hourly, i) => ({
    x: i,
    y: hourly.temperature,
    xLabel: hourly.time
  }));

  const hourlyHumidity: Point[] = hourlyWeather.map((hourly, i) => ({
    x: i,
    y: hourly.humidity,
  }));

  const combinedYPoints = getCombinedYRange(hourlyTemps.map(temp => temp.y));
  const dataTop = chartTop + 59;
  const dataLeft = chartLeft + 95;
  const labelTop = dataTop - 18;
  const labelLeft = dataLeft + 113;

  return (
    <Box sx={{
      position: 'relative',
      height: '353px',
      width: '615px',
    }}
    >
      <Box
        sx={{
          fontWeight: 700,
          fontSize: '22px',
          textAlign: 'center',
          position: 'absolute',
          top: `${chartTop}px`,
          width: '410px',
          left: `${chartLeft + 93}px`
        }}
      >
        {title}
      </Box>
      <YAxis style={{ position: "absolute", top: `${dataTop - 1}px`, left: `${dataLeft - 89}px`}} labeledYPoints={combinedYPoints} getLabel={(y) => getTempAndHumidityLabel(getTemperatureLabel(y), 'N/A')} graphWidth={graphWidth} height={graphHeight} textSpace={65}></YAxis>

      <CurvyTimeGraphAnimator id="dashed" width={graphWidth} data={hourlyHumidity} delay={0}>
        {(refs) => (
          <CurvyTimeGraph animationRefs={refs} id='dashed' width={graphWidth} height={graphHeight} style={{ position: "absolute", top: `${dataTop}px`, left: `${dataLeft}px` }} data={hourlyHumidity} yRange={[0, 100]} gradientstops={[theme.palette.pink.main, "white"]} gradientDirection='h' type="dashed-line"/>
        )}
      </CurvyTimeGraphAnimator>
      <RightDataLabel label="HUMIDITY" labelColor={theme.palette.pink.light} width={graphWidth} height={graphHeight} style={{ position: "absolute", top: `${labelTop}px`, left: `${labelLeft - 35}px` }} data={hourlyHumidity} yRange={[0, 100]}></RightDataLabel>

      <CurvyTimeGraphAnimator id="line" width={graphWidth} data={hourlyTemps} delay={.5}>
        {(refs) => ( 
          <CurvyTimeGraph animationRefs={refs} id='line' width={graphWidth} height={graphHeight} style={{ position: "absolute", top: `${dataTop}px`, left: `${dataLeft}px`  }} data={hourlyTemps} gradientstops={[theme.palette.teal.main, theme.palette.purple.main]} type="line-area"/>
        )}
      </CurvyTimeGraphAnimator>
      <RightDataLabel label="TEMPERATURE" labelColor={theme.palette.purple.main} width={graphWidth} height={graphHeight} style={{ position: "absolute", top: `${labelTop}px`, left: `${labelLeft}px`  }} data={hourlyTemps} ></RightDataLabel>

      <XAxis width={graphWidth} style={{ position: "absolute", top: `calc(${graphHeight}px + ${dataTop + 7}px)`, left: `${dataLeft}px` }} data={hourlyTemps} labelFrequency={4}></XAxis>
    </Box>
  )
}

const getTempAndHumidityLabel = (tempLabel: string, humidityLabel: string): string => {
  return `${tempLabel} • ${humidityLabel}`
}

const getCombinedYRange = (temperatures: number[]): LabeledYPoint[] => {
  // NOTE: Even though the y values are different for these 2 data sets
  // they will be normalized to the same svg y coordinate in yAxis component
  // So we can combine the lables for each data set
  // And they should line up correctly on the graph

  const totalDataPoints = 23;
  const maxTemp: number = Math.max(...temperatures);
  const minTemp: number = Math.min(...temperatures);
  const tempLabels: LabeledYPoint[] = determineYRangePoints([minTemp, maxTemp], totalDataPoints, getTemperatureLabel);

  const humidityLabels: LabeledYPoint[] = determineYRangePoints([0, 100], totalDataPoints, getHumidityLabel);

  return tempLabels.map((tempY, i) => ({
    ...tempY,
    yLabel: getTempAndHumidityLabel(tempY.yLabel, humidityLabels[i].yLabel),
  }));
}

export default TempVHumidityGraph;
