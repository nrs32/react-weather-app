import { CurvyGraph, type HexColor, type LabeledXPoint, type LabeledYPoint, type Point } from 'curvy-graphs'
import { generateLabeledYPoints } from 'curvy-graphs/parts';
import { useTheme } from '@mui/material/styles';
import type React from 'react';

import getTemperatureLabel from '../../utils/get-temperature-label';
import type { HourlyWeather } from '../../types/weather-types';
import getHumidityLabel from '../../utils/get-humidity-label';
import { useScrollTriggeredChartData } from '../../hooks/use-scroll-trigger-animation';
import { useCallback, useMemo, useRef, useState } from 'react';

interface TempVHumidityGraphProps {
  hourlyWeather: HourlyWeather[],
}

const WIDTH = 613;
const defaultData = {
  humidity: [],
  temps: [],
};

const TempVHumidityGraph: React.FC<TempVHumidityGraphProps> = ({ hourlyWeather }) => {
  const theme = useTheme();
  const curvyGraphRef = useRef<HTMLDivElement>(null);
  const [ chartData, setChartData ] = useState<{
    humidity: Point[],
    temps: (LabeledXPoint & Point)[],
  }>(defaultData);
  

  const hourlyTemps: (LabeledXPoint & Point)[] = useMemo(() => hourlyWeather.map((hourly, i) => ({
    x: i,
    y: hourly.temperature,
    xLabel: hourly.time
  })), [hourlyWeather]);

  const hourlyHumidity: Point[] = useMemo(() => hourlyWeather.map((hourly, i) => ({
    x: i,
    y: hourly.humidity,
  })), [hourlyWeather]);

  const combinedYPoints = getCombinedYRange(hourlyTemps.map(temp => temp.y) as number[]);

  const setDefaultData = useCallback(() => {
    setChartData(defaultData);
  }, [defaultData]);

  const setActualData = useCallback(() => {
    setChartData({
      humidity: hourlyHumidity,
      temps: hourlyTemps,
    });
  }, [hourlyHumidity, hourlyTemps]);

  // Everything memo-ized since this method triggers methods that change state, otherwise causing infinite loops
  useScrollTriggeredChartData({ ref: curvyGraphRef, setDefaultData,setActualData });
  
  return (
    <div ref={curvyGraphRef}>
      <CurvyGraph
        chartTitle='Humidity and Temperature (Sun 6/1)'
        spaceBelowData={20}
        width={WIDTH}
        height={310}
        textColor={theme.palette.text.primary as HexColor}
        animate={true}
        yAxis={{
          labeledPoints: combinedYPoints,
          getExtendedYLabel: (y) => getTempAndHumidityLabel(getTemperatureLabel(y), 'N/A'),
          labelFrequency: 5,
        }}
        dataSets={[
          {
            id: 'humidity',
            graphStyle: 'dashed-line',
            label: 'HUMIDITY',
            labelColor: theme.palette.pink.light,
            gradientColorStops: [theme.palette.pink.main, "white"],
            gradientDirection: 'h',
            yRange: [0, 100],
            animationDelay: 0,
            data: chartData.humidity,
            tooltipConfig: {
              getCustomLabel: (x, y) => {
                return `${getHumidityLabel(y)} humidity at ${getXLabel(x, hourlyTemps)}`
              },
            },
          },
          {
            id: 'temperature-area',
            graphStyle: 'area',
            label: '',
            labelColor: theme.palette.purple.main,
            gradientColorStops: [theme.palette.teal.main, theme.palette.purple.main],
            gradientTransparencyStops: [0.5, 0],
            gradientDirection: 'v',
            animationDelay: 0.5,
            data: chartData.temps,
          },
          {
            id: 'temperature-line',
            graphStyle: 'line',
            label: 'TEMPERATURE',
            labelColor: theme.palette.purple.main,
            gradientColorStops: [theme.palette.teal.main, theme.palette.purple.main],
            gradientDirection: 'v',
            animationDelay: 0.5,
            data: chartData.temps,
            tooltipConfig: {
              getCustomLabel: (x, y) => {
                return `${getTemperatureLabel(y)} at ${getXLabel(x, hourlyTemps)}`
              },
            },
          }
        ]}
        xAxis={{
          labeledPoints: hourlyTemps,
          labelFrequency: 4,
        }}
        styles={{
          rightDataLabels: {
            textStyle: { letterSpacing: '.75px' },
          },
        }}
      />
    </div>
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

  const totalDataPoints = 24;
  const maxTemp: number = Math.max(...temperatures);
  const minTemp: number = Math.min(...temperatures);
  const tempLabels: LabeledYPoint[] = generateLabeledYPoints([minTemp, maxTemp], totalDataPoints, getTemperatureLabel);

  const humidityLabels: LabeledYPoint[] = generateLabeledYPoints([0, 100], totalDataPoints, getHumidityLabel);

  return tempLabels.map((tempY, i) => ({
    ...tempY,
    yLabel: getTempAndHumidityLabel(tempY.yLabel, humidityLabels[i].yLabel),
  }));
}

export const getXLabel = (x: number, hourlyTemps: (LabeledXPoint & Point)[]) => hourlyTemps.find(temp => temp.x === x)?.xLabel as string;

export default TempVHumidityGraph;
