import { useTheme } from '@mui/material/styles';
import { CurvyGraph, type LabeledXPoint, type LabeledYPoint, type Point } from 'curvy-graphs';
import { useCallback, useContext, useMemo, useRef, useState } from 'react';
import type React from 'react';

import { dayKeys, type DayWeather } from '../../types/weather-types';
import getTemperatureLabel from '../../utils/get-temperature-label';
import { WeatherContext } from '../../App';
import { generateLabeledYPoints } from 'curvy-graphs/parts';
import { useScrollTriggeredChartData } from '../../hooks/use-scroll-trigger-animation';

interface WeeklyTempSpreadGraphProps {
  title: string;
}

const defaultData = {
  min: [],
  avg: [],
  max: [],
};

const WeeklyTempSpreadGraph: React.FC<WeeklyTempSpreadGraphProps> = ({ title }) => {
  const weatherData = useContext(WeatherContext)!;
  const curvyGraphRef = useRef<HTMLDivElement>(null);
  const [ chartData, setChartData ] = useState<{
    min: (LabeledXPoint & Point)[],
    avg: Point[],
    max: Point[],
  }>(defaultData);
  
  const theme = useTheme();

  const allTemps: DayWeather[] = useMemo(() => dayKeys.map(key => weatherData[key]), [weatherData]);

  const weeklyMin: number = Math.min(...allTemps.map(day => day.tempMin));
  const weeklyMax: number = Math.max(...allTemps.map(day => day.tempMax));
  const yRange: [number, number] = [weeklyMin, weeklyMax];

  const dailyMinTemps: (LabeledXPoint & Point)[] = useMemo(() => allTemps.map((d, i) => ({ x: i, y: d.tempMin, xLabel: d.dayOfWeek, xSubLabel: d.date})), [allTemps]);
  const dailyAvgTemps: Point[] = useMemo(() => allTemps.map((d, i) => ({ x: i, y: d.tempAvg })), [allTemps]);
  const dailyMaxTemps: Point[] = useMemo(() => allTemps.map((d, i) => ({ x: i, y: d.tempMax })), [allTemps]);

  const dailyYPoints: LabeledYPoint[] = generateLabeledYPoints([weeklyMin, weeklyMax], 24, getTemperatureLabel);

  const setDefaultData = useCallback(() => {
    setChartData(defaultData);
  }, [defaultData]);

  const setActualData = useCallback(() => {
    setChartData({
      min: dailyMinTemps,
      avg: dailyAvgTemps,
      max: dailyMaxTemps,
    });
  }, [dailyMinTemps, dailyAvgTemps, dailyMaxTemps]);

  // Everything memo-ized since this method triggers methods that change state, otherwise causing infinite loops
  useScrollTriggeredChartData({ ref: curvyGraphRef, setDefaultData,setActualData });

  return (
    <div ref={curvyGraphRef}>
      <CurvyGraph 
        chartTitle={title} 
        spaceBelowData={20}
        width={600}
        height={335}
        textColor='#E0E1E2'
        animate={true}
        yAxis={{
          labeledPoints: dailyYPoints,
          getExtendedYLabel: getTemperatureLabel,
          labelFrequency: 5
        }}
        dataSets={[
          {
            id: 'max-daily-temp',
            graphStyle: 'area',
            label: 'MAX DAILY TEMP',
            labelColor: theme.palette.pink.light,
            gradientColorStops: [theme.palette.pink.main, theme.palette.pink.light],
            gradientDirection: 'h',
            yRange: yRange,
            animationDelay: 3,
            data: chartData.max,
          },
          {
            id: 'avg-daily-temp',
            graphStyle: 'area',
            label: 'AVG DAILY TEMP',
            labelColor: theme.palette.blue.main,
            gradientColorStops: [theme.palette.teal.main, theme.palette.purple.main],
            gradientDirection: 'h',
            yRange: yRange,
            animationDelay: 1.5,
            data: chartData.avg,
          },
          {
            id: 'min-daily-temp',
            graphStyle: 'area',
            label: 'MIN DAILY TEMP',
            labelColor: theme.palette.pink.main,
            gradientColorStops: [theme.palette.purple.main, theme.palette.pink.main],
            gradientDirection: 'h',
            yRange: yRange,
            animationDelay: 0,
            data: chartData.min,
          },
        ]}
        xAxis={{
          labeledPoints: dailyMinTemps,
        }}
        styles={{
          rightDataLabels: {
            textStyle: { letterSpacing: '.75px' }
          }
        }}/>
      </div>
  )
}

export default WeeklyTempSpreadGraph
