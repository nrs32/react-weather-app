import { useTheme } from '@mui/material/styles';

import { dayKeys, type DayWeather } from '../../types/weather-types';
import determineYRangePoints from '../../utils/determine-y-range-points';
import YAxis from '../../components/graphs-parts/y-axis';
import CurvyTimeGraph from '../../components/graphs-parts/curvy-time-graph';
import XAxis from '../../components/graphs-parts/x-axis';
import type { GraphProps, LabeledXPoint, LabeledYPoint, Point } from '../../types/graph-types';
import type React from 'react';
import getTemperatureLabel from '../../utils/get-y-label';
import RightDataLabel from '../../components/graphs-parts/right-data-label';
import Box from '@mui/material/Box';
import CurvyTimeGraphAnimator from '../../components/graphs-parts/curvy-time-graph-animator';
import { useContext } from 'react';
import { WeatherContext } from '../../App';

interface WeeklyTempSpreadGraphProps extends GraphProps {
  title: string;
}

const WeeklyTempSpreadGraph: React.FC<WeeklyTempSpreadGraphProps> = ({ title, graphWidth, graphHeight, chartTop, chartLeft }) => {
  const weatherData = useContext(WeatherContext)!;
  const theme = useTheme();

  const allTemps: DayWeather[] = dayKeys.map(key => weatherData[key]);

  const weeklyMin: number = Math.min(...allTemps.map(day => day.tempMin));
  const weeklyMax: number = Math.max(...allTemps.map(day => day.tempMax));

  const dailyMinTemps: LabeledXPoint[] = allTemps.map((d, i) => ({ x: i, y: d.tempMin, xLabel: d.dayOfWeek, xSubLabel: d.date}));
  const dailyAvgTemps: Point[] = allTemps.map((d, i) => ({ x: i, y: d.tempAvg }));
  const dailyMaxTemps: Point[] = allTemps.map((d, i) => ({ x: i, y: d.tempMax }));

  const dailyYPoints: LabeledYPoint[] = determineYRangePoints([weeklyMin, weeklyMax], 23, getTemperatureLabel);

  const dataTop = chartTop + 60;
  const dataLeft = chartLeft + 70;
  const labelLeft = dataLeft + 125;

  return (
    <Box sx={{
      position: 'relative',
      height: '366px',
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
          left: `${chartLeft + 63}px`
        }}
      >
        {title}
      </Box>
      <YAxis style={{ position: "absolute", top: `${dataTop + 1}px`, left: `${dataLeft - 54}px` }} labeledYPoints={dailyYPoints} getLabel={getTemperatureLabel} graphWidth={graphWidth} height={graphHeight} textSpace={30}></YAxis>

      <CurvyTimeGraphAnimator id="day-max-temp" width={graphWidth} data={dailyMaxTemps} delay={3}>
        {(refs) => (
          <CurvyTimeGraph animationRefs={refs} id="day-max-temp" width={graphWidth} height={graphHeight} style={{ position: "absolute", top: `${dataTop}px`, left: `${dataLeft}px` }} data={dailyMaxTemps} yRange={[weeklyMin, weeklyMax]} gradientstops={[theme.palette.pink.main, theme.palette.pink.light]} gradientDirection='h' type="area"/>
        )}
      </CurvyTimeGraphAnimator>
      <RightDataLabel label="MAX DAILY TEMP" labelColor={theme.palette.pink.light} width={graphWidth} height={graphHeight} style={{ position: "absolute", top: `${dataTop}px`, left: `${labelLeft + 3}px` }} data={dailyMaxTemps} yRange={[weeklyMin, weeklyMax]}></RightDataLabel>

      <CurvyTimeGraphAnimator id="day-avg-temp" width={graphWidth} data={dailyAvgTemps} delay={1.5}>
        {(refs) => (
          <CurvyTimeGraph animationRefs={refs} id="day-avg-temp" width={graphWidth} height={graphHeight} style={{ position: "absolute", top: `${dataTop}px`, left: `${dataLeft}px` }} data={dailyAvgTemps} yRange={[weeklyMin, weeklyMax]} gradientstops={[theme.palette.teal.main, theme.palette.purple.main]} gradientDirection='h' showAreaShadow={true} type="area"/>
        )}
      </CurvyTimeGraphAnimator>
      <RightDataLabel label="AVG DAILY TEMP" labelColor={theme.palette.blue.main} width={graphWidth} height={graphHeight} style={{ position: "absolute", top: `${dataTop}px`, left: `${labelLeft + 1}px` }} data={dailyAvgTemps} yRange={[weeklyMin, weeklyMax]}></RightDataLabel>

      <CurvyTimeGraphAnimator id="day-min-temp" width={graphWidth} data={dailyMinTemps} delay={0}>
        {(refs) => (
          <CurvyTimeGraph animationRefs={refs} id="day-min-temp" width={graphWidth} height={graphHeight} style={{ position: "absolute", top: `${dataTop}px`, left: `${dataLeft}px` }} data={dailyMinTemps} yRange={[weeklyMin, weeklyMax]} gradientstops={[theme.palette.purple.main, theme.palette.pink.main]} gradientDirection='h' showAreaShadow={true} type="area"/>
        )}
      </CurvyTimeGraphAnimator>
      <RightDataLabel label="MIN DAILY TEMP" labelColor={theme.palette.pink.main} width={graphWidth} height={graphHeight} style={{ position: "absolute", top: `${dataTop}px`, left: `${labelLeft}px` }} data={dailyMinTemps} yRange={[weeklyMin, weeklyMax]}></RightDataLabel>

      <XAxis width={graphWidth} style={{ position: "absolute", top: `calc(${graphHeight}px + ${dataTop + 2}px)`, left: `${dataLeft}px` }} data={dailyMinTemps}></XAxis>
    </Box>
  )
}

export default WeeklyTempSpreadGraph
