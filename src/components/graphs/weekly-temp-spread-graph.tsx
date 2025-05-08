import { useTheme } from '@mui/material/styles';

import type { DayKey, DayWeather, WeatherData } from '../../types/weather-types';
import determineYRangePoints from '../../utils/determine-y-range-points';
import YAxis from '../graphs-parts/y-axis';
import CurvyTimeGraph from '../graphs-parts/curvy-time-graph';
import XAxis from '../graphs-parts/x-axis';
import type { GraphProps, LabeledXPoint, LabeledYPoint, Point } from '../../types/graph-types';
import type React from 'react';
import getTemperatureLabel from '../../utils/get-y-label';
import RightDataLabel from '../graphs-parts/right-data-label';
import Box from '@mui/material/Box';

interface WeeklyTempSpreadGraphProps extends GraphProps {
  title: string;
  weatherData: WeatherData,
}

const WeeklyTempSpreadGraph: React.FC<WeeklyTempSpreadGraphProps> = ({ title, weatherData, graphWidth, graphHeight, chartTop, chartLeft }) => {
  const theme = useTheme();

  const dayKeys: DayKey[] = Array.from({ length: 7 }, (_, i) => `day${i + 1}` as DayKey);
  const allTemps: DayWeather[] = dayKeys.map(key => weatherData[key]);

  const weeklyMin: number = Math.min(...allTemps.map(day => day.tempMin));
  const weeklyMax: number = Math.max(...allTemps.map(day => day.tempMax));

  const dailyMinTemps: LabeledXPoint[] = allTemps.map((d, i) => ({ x: i, y: d.tempMin, xLabel: d.dayOfWeek, xSubLabel: d.date}));
  const dailyAvgTemps: Point[] = allTemps.map((d, i) => ({ x: i, y: d.tempAvg }));
  const dailyMaxTemps: Point[] = allTemps.map((d, i) => ({ x: i, y: d.tempMax }));

  const dailyYPoints: LabeledYPoint[] = determineYRangePoints([weeklyMin, weeklyMax], 23, getTemperatureLabel);

  const labelLeft = chartLeft + 125;

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
          left: '83px'
        }}
      >
        {title}
      </Box>
      <YAxis style={{ position: "absolute", top: `${chartTop + 1}px`, left: `${chartLeft - 54}px` }} labeledYPoints={dailyYPoints} getLabel={getTemperatureLabel} graphWidth={graphWidth} height={graphHeight} textSpace={30}></YAxis>

      <CurvyTimeGraph id="day-max-temp" width={graphWidth} height={graphHeight} style={{ position: "absolute", top: `${chartTop}px`, left: `${chartLeft}px` }} data={dailyMaxTemps} yRange={[weeklyMin, weeklyMax]} gradientstops={[theme.palette.pink.main, theme.palette.pink.light]} gradientDirection='h' type="area"/>
      <RightDataLabel label="MAX DAILY TEMP" labelColor={theme.palette.pink.light} width={graphWidth} height={graphHeight} style={{ position: "absolute", top: `${chartTop}px`, left: `${labelLeft + 3}px` }} data={dailyMaxTemps} yRange={[weeklyMin, weeklyMax]}></RightDataLabel>

      <CurvyTimeGraph id="day-avg-temp" width={graphWidth} height={graphHeight} style={{ position: "absolute", top: `${chartTop}px`, left: `${chartLeft}px` }} data={dailyAvgTemps} yRange={[weeklyMin, weeklyMax]} gradientstops={[theme.palette.teal.main, theme.palette.purple.main]} gradientDirection='h' showAreaShadow={true} type="area"/>
      <RightDataLabel label="AVG DAILY TEMP" labelColor={theme.palette.blue.main} width={graphWidth} height={graphHeight} style={{ position: "absolute", top: `${chartTop}px`, left: `${labelLeft + 1}px` }} data={dailyAvgTemps} yRange={[weeklyMin, weeklyMax]}></RightDataLabel>

      <CurvyTimeGraph id="day-min-temp" width={graphWidth} height={graphHeight} style={{ position: "absolute", top: `${chartTop}px`, left: `${chartLeft}px` }} data={dailyMinTemps} yRange={[weeklyMin, weeklyMax]} gradientstops={[theme.palette.purple.main, theme.palette.pink.main]} gradientDirection='h' showAreaShadow={true} type="area"/>
      <RightDataLabel label="MIN DAILY TEMP" labelColor={theme.palette.pink.main} width={graphWidth} height={graphHeight} style={{ position: "absolute", top: `${chartTop}px`, left: `${labelLeft}px` }} data={dailyMinTemps} yRange={[weeklyMin, weeklyMax]}></RightDataLabel>

      <XAxis width={graphWidth} style={{ position: "absolute", top: `calc(${graphHeight}px + ${chartTop + 2}px)`, left: `${chartLeft}px` }} data={dailyMinTemps}></XAxis>
    </>
  )
}

export default WeeklyTempSpreadGraph
