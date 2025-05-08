import { useTheme } from '@mui/material/styles';

import type React from 'react';
import type { HourlyWeather } from '../../types/weather-types';
import type { GraphProps, LabeledXPoint, LabeledYPoint, Point } from '../../types/graph-types';
import determineYRangePoints from '../../utils/determine-y-range-points';
import YAxis from '../graphs-parts/y-axis';
import CurvyTimeGraph from '../graphs-parts/curvy-time-graph';
import XAxis from '../graphs-parts/x-axis';
import getTemperatureLabel from '../../utils/get-y-label';
import getHumidityLabel from '../../utils/get-humidity-label';
import RightDataLabel from '../graphs-parts/right-data-label';
import Box from '@mui/material/Box';

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
  const labelLeft = chartLeft + 113;
  const labelTop = chartTop - 18;

  return (
    <>
      <Box
        sx={{
          fontWeight: 700,
          fontSize: '22px',
          textAlign: 'center',
          position: 'absolute',
          top: '45px',
          width: '410px',
          left: '142px'
        }}
      >
        {title}
      </Box>
      <YAxis style={{ position: "absolute", top: `${chartTop - 1}px`, left: `${chartLeft - 89}px`}} labeledYPoints={combinedYPoints} getLabel={(y) => getTempAndHumidityLabel(getTemperatureLabel(y), 'N/A')} graphWidth={graphWidth} height={graphHeight} textSpace={65}></YAxis>

      <CurvyTimeGraph id="dashed" width={graphWidth} height={graphHeight} style={{ position: "absolute", top: `${chartTop}px`, left: `${chartLeft}px` }} data={hourlyHumidity} yRange={[0, 100]} gradientstops={[theme.palette.pink.main, "white"]} gradientDirection='h' type="dashed-line"/>
      <RightDataLabel label="HUMIDITY" labelColor={theme.palette.pink.light} width={graphWidth} height={graphHeight} style={{ position: "absolute", top: `${labelTop}px`, left: `${labelLeft - 35}px` }} data={hourlyHumidity} yRange={[0, 100]}></RightDataLabel>

      <CurvyTimeGraph id="line" width={graphWidth} height={graphHeight} style={{ position: "absolute", top: `${chartTop}px`, left: `${chartLeft}px`  }} data={hourlyTemps} gradientstops={[theme.palette.teal.main, theme.palette.purple.main]} type="line-area"/>
      <RightDataLabel label="TEMPERATURE" labelColor={theme.palette.purple.main} width={graphWidth} height={graphHeight} style={{ position: "absolute", top: `${labelTop}px`, left: `${labelLeft}px`  }} data={hourlyTemps} ></RightDataLabel>

      <XAxis width={graphWidth} style={{ position: "absolute", top: `calc(${graphHeight}px + ${chartTop + 7}px)`, left: `${chartLeft}px` }} data={hourlyTemps} labelFrequency={4}></XAxis>
    </>
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
