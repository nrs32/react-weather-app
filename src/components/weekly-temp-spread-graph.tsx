import { useTheme } from '@mui/material/styles';

import type { DayKey, DayWeather, WeatherData } from '../types/weather-types';
import determineYRangePoints from '../utils/determine-y-range-points';
import YAxis from './graphs-parts/y-axis';
import CurvyTimeGraph from './graphs-parts/curvy-time-graph';
import XAxis from './graphs-parts/x-axis';
import type { LabeledXPoint, LabeledYPoint, Point } from '../types/graph-types';
import type React from 'react';

const WeeklyTempSpreadGraph: React.FC<{weatherData: WeatherData}> = ({ weatherData }) => {
  const theme = useTheme();

  const dayKeys: DayKey[] = Array.from({ length: 7 }, (_, i) => `day${i + 1}` as DayKey);
  const allTemps: DayWeather[] = dayKeys.map(key => weatherData[key]);

  const weeklyMin: number = Math.min(...allTemps.map(day => day.tempMin));
  const weeklyMax: number = Math.max(...allTemps.map(day => day.tempMax));

  const dailyMinTemps: LabeledXPoint[] = allTemps.map((d, i) => ({ x: i, y: d.tempMin, xLabel: d.dayOfWeek, xSubLabel: d.date}));
  const dailyAvgTemps: Point[] = allTemps.map((d, i) => ({ x: i, y: d.tempAvg }));
  const dailyMaxTemps: Point[] = allTemps.map((d, i) => ({ x: i, y: d.tempMax }));

  const dailyYPoints: LabeledYPoint[] = determineYRangePoints([weeklyMin, weeklyMax], 25, (y) => {
    return `${Math.round(y)}°F`
  });

  // TODO: considar making these props instead
  const graphWidth: number = 400;
  const graphHeight: number = 200;
  const chartTop: number = 45;
  const chartLeft: number = 64;

  return (
    <>
      <YAxis style={{ position: "absolute", top: `${chartTop -1}px`, left: `${chartLeft - 54}px` }} labeledYPoints={dailyYPoints} graphWidth={graphWidth} height={graphHeight} textSpace={30}></YAxis>
      <CurvyTimeGraph id="day-max-temp" width={graphWidth} height={graphHeight} style={{ position: "absolute", top: `${chartTop}px`, left: `${chartLeft}px` }} data={dailyMaxTemps} yRange={[weeklyMin, weeklyMax]} gradientstops={[theme.palette.pink.main, theme.palette.pink.light]} gradientDirection='h' type="area"/>
      <CurvyTimeGraph id="day-avg-temp" width={graphWidth} height={graphHeight} style={{ position: "absolute", top: `${chartTop}px`, left: `${chartLeft}px` }} data={dailyAvgTemps} yRange={[weeklyMin, weeklyMax]} gradientstops={[theme.palette.teal.main, theme.palette.purple.main]} gradientDirection='h' showAreaShadow={true} type="area"/>
      <CurvyTimeGraph id="day-min-temp" width={graphWidth} height={graphHeight} style={{ position: "absolute", top: `${chartTop}px`, left: `${chartLeft}px` }} data={dailyMinTemps} yRange={[weeklyMin, weeklyMax]} gradientstops={[theme.palette.purple.main, theme.palette.pink.main]} gradientDirection='h' showAreaShadow={true} type="area"/>
      <XAxis width={graphWidth} style={{ position: "absolute", top: `calc(${graphHeight}px + ${chartTop}px)`, left: `${chartLeft}px` }} data={dailyMinTemps}></XAxis>
    </>
  )
}

export default WeeklyTempSpreadGraph
