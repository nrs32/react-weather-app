import { useTheme } from '@mui/material/styles';

import type React from 'react';
import type { HourlyWeather } from '../types/weather-types';
import type { LabeledXPoint, LabeledYPoint, Point } from '../types/graph-types';
import determineYRangePoints from '../utils/determine-y-range-points';
import YAxis from './graphs-parts/y-axis';
import CurvyTimeGraph from './graphs-parts/curvy-time-graph';
import XAxis from './graphs-parts/x-axis';

const TempVHumidityGraph: React.FC<{hourlyWeather: HourlyWeather[]}> = ({ hourlyWeather }) => {
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

  // TODO: considar making these props instead
  const graphWidth: number = 400;
  const graphHeight: number = 200;
  const chartTop: number = 45;
  const chartLeft: number = 109;

  return (
    <>
      <YAxis style={{ position: "absolute", top: `${chartTop - 1}px`, left: `${chartLeft - 84}px`}} labeledYPoints={combinedYPoints} graphWidth={graphWidth} height={graphHeight} textSpace={65}></YAxis>
      <CurvyTimeGraph id="dashed" width={graphWidth} height={graphHeight} style={{ position: "absolute", top: `${chartTop}px`, left: `${chartLeft}px` }} data={hourlyHumidity} yRange={[0, 100]} gradientstops={[theme.palette.pink.main, "white"]} gradientDirection='h' type="dashed-line"/>
      <CurvyTimeGraph id="line" width={graphWidth} height={graphHeight} style={{ position: "absolute", top: `${chartTop}px`, left: `${chartLeft}px`  }} data={hourlyTemps} gradientstops={[theme.palette.teal.main, theme.palette.purple.main]} type="line-area"/>
      <XAxis width={graphWidth} style={{ position: "absolute", top: `calc(${graphHeight}px + ${chartTop}px)`, left: `${chartLeft}px` }} data={hourlyTemps} labelFrequency={4}></XAxis>
    </>
  )
}

const getCombinedYRange = (temperatures: number[]): LabeledYPoint[] => {
  // NOTE: Even though the y values are different for these 2 data sets
  // they will be normalized to the same svg y coordinate in yAxis component
  // So we can combine the lables for each data set
  // And they should line up correctly on the graph

  const maxTemp: number = Math.max(...temperatures);
  const minTemp: number = Math.min(...temperatures);
  const tempLabels: LabeledYPoint[] = determineYRangePoints([minTemp, maxTemp], 25, 5, (y) => {
    return `${Math.round(y)}°F`
  });

  const humidityLabels: LabeledYPoint[] = determineYRangePoints([0, 100], 25, 0, (y) => {
    return `${Math.round(y)}%`
  });

  return tempLabels.map((tempY, i) => ({
    ...tempY,
    yLabel: `${tempY.yLabel} • ${humidityLabels[i].yLabel}`
  }));
}

export default TempVHumidityGraph;
