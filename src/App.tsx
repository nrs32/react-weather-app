import { useTheme } from '@mui/material/styles';
import { useQuery } from '@tanstack/react-query'

import reactLogo from './assets/react.svg'
import openMedeoLogo from './assets/open-medeo.png'
import viteLogo from '/vite.svg'
import './App.scss';
import { getWeather } from './services/weather-service'
import WeatherCard from './components/weather-card'
import GradientCircularProgress from './components/gradient-circular-progress'
import type { DayKey, WeatherData } from './types/weather-types';
import CurvyTimeGraph from './components/graphs/curvy-time-graph';
import Box from '@mui/material/Box';
import RawDataModal from './components/raw-data-modal';
import XAxis from './components/graphs/x-axis';
import YAxis from './components/graphs/y-axis';
import determineYRangePoints from './utils/determine-y-range-points';

function App() {
  const theme = useTheme();

  // TODO: considar ipinfo.io to get user lat and long
  // Then do the thing from the video where we wait for that query before doing the one that gets the weather
  const lat: number = 42.96;
  const long: number = -85.67;
  const { isPending, isError, data, error } = useQuery({
    // queryKey is a unique key to cache results from this call
    // e.g. controller name, route, and any params you pass the call
    queryKey: ['weather', lat, long],
    queryFn: () => getWeather(lat, long)
  });

  if (isPending) {
    return <span>Loading...</span>
  }

  if (isError) {
    return <span>Error: {error.message}</span>
  }

  const weatherData = data as WeatherData;

  ////////////////////////////////////////////////////////////////////
  // Get Temp / Humidity Data
  // TODO: use hook and option for user to switch which days data they're viewing
  // Then recalc this based on selected day and display that data
  const temperaturesCurrentDay = weatherData.day1.hourlyWeather.map((hourly, i) => ({
    x: i,
    y: hourly.temperature,
    xLabel: hourly.time
  }));

  const humidityCurrentDay = weatherData.day1.hourlyWeather.map((hourly, i) => ({
    x: i,
    y: hourly.humidity,
  }));

  const currentDayTemps = temperaturesCurrentDay.map(temp => temp.y);
  const maxTemp = Math.max(...currentDayTemps);
  const minTemp = Math.min(...currentDayTemps);

 // NOTE: Even thoygh the y values are different for these 2 calc
 // They will be normalized to the same svg y coordinate
 // So we can combine the lables and should line up correctly for each data set
  const currentTempYPoints = determineYRangePoints([minTemp, maxTemp], 25, (y) => {
    return `${Math.round(y)}°F`
  });

  const adjustedMaxHumidity = 95; // Fn will add 5 to account for chart height
  const currentHumidityYPoints = determineYRangePoints([0, adjustedMaxHumidity], 25, (y) => {
    return `${Math.round(y)}%`
  });

  console.log(currentTempYPoints, currentHumidityYPoints)

  const combinedCurrentYPoints = currentTempYPoints.map((tempY, i) => ({
    ...tempY,
    yLabel: `${tempY.yLabel} • ${currentHumidityYPoints[i].yLabel}`
  }));
  ////////////////////////////////////////////////////////////////////


  ////////////////////////////////////////////////////////////////////
  // Get weekly graph data
  const dayKeys: DayKey[] = Array.from({ length: 7 }, (_, i) => `day${i + 1}` as DayKey);
  const allTemps = dayKeys.map(key => weatherData[key]);
  const weeklyMinTemp = Math.min(...allTemps.map(day => day.tempMin));
  const weeklyMaxTemp = Math.max(...allTemps.map(day => day.tempMax));

  const dailyMinTemp = allTemps.map((d, i) => ({ x: i, y: d.tempMin, xLabel: d.dayOfWeek, xSubLabel: d.date}));
  const dailyAvgTemp = allTemps.map((d, i) => ({ x: i, y: d.tempAvg }));
  const dailyMaxTemp = allTemps.map((d, i) => ({ x: i, y: d.tempMax }));

  const dailyYPoints = determineYRangePoints([weeklyMinTemp, weeklyMaxTemp], 25, (y) => {return `${Math.round(y)}°F`});

  ////////////////////////////////////////////////////////////////////

  return (
    <>
     <h1 className='heading'> Weather Dashboard </h1>
      <WeatherCard>
        <GradientCircularProgress
          id="humidity"
          value={weatherData.current.humidity}
          label={`${weatherData.current.humidity}`}
          labelcolor={theme.palette.teal.main}
          labelsize={50}
          subtitle='Humidity'
          thickness={3.5}
          size={140}
          gradientstops={[theme.palette.teal.main, theme.palette.blue.main]}
        />
        <span style={{ paddingLeft: "30px" }}>
          <GradientCircularProgress
            id="precipitation"
            value={weatherData.current.precipitation}
            label={`${weatherData.current.precipitation}`}
            labelcolor={theme.palette.pink.main}
            labelsize={50}
            subtitle='Precip.'
            thickness={3.5}
            size={140}
            gradientstops={[theme.palette.purple.main, theme.palette.pink.main]}
          />
        </span>
        <span style={{ paddingLeft: "30px" }}>
          <GradientCircularProgress
            id="cloud_cover"
            value={weatherData.current.cloudCover}
            label={`${weatherData.current.cloudCover}`}
            labelcolor={theme.palette.pink.light}
            labelsize={50}
            subtitle='Cloud Cover'
            thickness={3.5}
            size={140}
            gradientstops={[theme.palette.pink.main, "white"]}
          />
        </span>
        <p>- show current weather data:</p>
        <p>- time, temp, (humidity, precip, cloud cover) weatherDesc, and icon for it</p>
      </WeatherCard>

      <WeatherCard width='500px' height='500px'>
        <YAxis
          style={{ position: "absolute", top: '44px', left: '10px' }}
          labeledYPoints={dailyYPoints}
          graphWidth={400}
          height={200}
          textSpace={30}
        >
        </YAxis>
        <CurvyTimeGraph id="day-max-temp" width={400} height={200} style={{ position: "absolute", top: '45px', left: '64px' }} data={dailyMaxTemp} yRange={[weeklyMinTemp, weeklyMaxTemp]} gradientstops={[theme.palette.pink.main, theme.palette.pink.light]} gradientDirection='h' type="area"/>
        <CurvyTimeGraph id="day-avg-temp" width={400} height={200} style={{ position: "absolute", top: '45px', left: '64px' }} data={dailyAvgTemp} yRange={[weeklyMinTemp, weeklyMaxTemp]} gradientstops={[theme.palette.teal.main, theme.palette.purple.main]} gradientDirection='h' showAreaShadow={true} type="area"/>
        <CurvyTimeGraph id="day-min-temp" width={400} height={200} style={{ position: "absolute", top: '45px', left: '64px' }} data={dailyMinTemp} yRange={[weeklyMinTemp, weeklyMaxTemp]} gradientstops={[theme.palette.purple.main, theme.palette.pink.main]} gradientDirection='h' showAreaShadow={true} type="area"/>
        <XAxis width={400} style={{ position: "absolute", top: 'calc(200px + 45px)', left: '64px' }} data={dailyMinTemp}></XAxis>

        <p style={{ paddingTop: '260px'}}>Weekly Temp Spread</p>
        <p>TODO:</p>
        <p>- refactor logic for this graph into own component</p>
        <p>- add labels to areas on graph</p>
        <p>- add x and y axis labels and background lines</p>
        <p>- add label with title at top of card</p>
      </WeatherCard>

      <WeatherCard width='500px' height='500px'>
      <YAxis
          style={{ position: "absolute", top: '44px', left: '25px' }}
          labeledYPoints={combinedCurrentYPoints}
          graphWidth={400}
          height={200}
          textSpace={65}
        >
        </YAxis>
        <CurvyTimeGraph id="dashed" width={400} height={200} style={{ position: "absolute", top: '45px', left: '109px' }} data={humidityCurrentDay} yRange={[0, 100]} gradientstops={[theme.palette.pink.main, "white"]} gradientDirection='h' type="dashed-line"/>
        <CurvyTimeGraph id="line" width={400} height={200} style={{ position: "absolute", top: '45px', left: '109px'  }} data={temperaturesCurrentDay} gradientstops={[theme.palette.teal.main, theme.palette.purple.main]} type="line-area"/>
        <XAxis width={400} style={{ position: "absolute", top: 'calc(200px + 45px)', left: '109px'  }} data={temperaturesCurrentDay} labelFrequency={4}></XAxis>

        <p style={{ paddingTop: '260px'}}>Daily Humidity and Temperature</p>
        <p>TODO:</p>
        <p>- refactor logic for this graph into own component</p>
        <p>- add labels to lines on graph</p>
        <p>- add x and y axis labels and background lines</p>
        <p>- add label with date at top of card, with arrows somewhere, like carosoul</p>
        <p>- arrows can go from one day to the next to view each day's humidity and temperature graph</p>
        <p>- also show icon for overall weather of day</p>
      </WeatherCard>

      <Box sx={(theme) => ({
        position: 'sticky',
        bottom: '7px',
        width: 'fit-content',
        left: '100vw',
        background: theme.palette.bg.main,
        padding: '10px 5px 0 10px',
        borderRadius: '5px',
        'a': {
          paddingLeft: '11px',
        }
      })}>
        <RawDataModal weatherData={weatherData}></RawDataModal>
        <a href="https://open-meteo.com" target="_blank">
          <img src={openMedeoLogo} width="30px" alt="Open-meteo logo" />
        </a>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} alt="React logo" />
        </a>
      </Box>
    </>
  )
}

export default App
