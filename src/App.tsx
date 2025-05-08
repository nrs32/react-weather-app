import { useTheme } from '@mui/material/styles';
import { useQuery } from '@tanstack/react-query'

import reactLogo from './assets/react.svg'
import openMedeoLogo from './assets/open-medeo.png'
import viteLogo from '/vite.svg'
import './App.scss';
import { getWeather } from './services/weather-service'
import WeatherCard from './components/weather-card'
import GradientCircularProgress from './components/gradient-circular-progress'
import type { WeatherData } from './types/weather-types';
import Box from '@mui/material/Box';
import RawDataModal from './components/raw-data-modal';
import WeeklyTempSpreadGraph from './components/graphs/weekly-temp-spread-graph';
import TempVHumidityGraph from './components/graphs/temp-v-humidity-graph';

function App() {
  const theme = useTheme();

  // TODO: considar ipinfo.io to get user lat and long
  // Then do the thing from the video where we wait for that query before doing the one that gets the weather

  // TODO: auto-refresh data at some interval
  // TODO: maybe allow user to manually refresh (?)
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

      <WeatherCard width='580px' height='345px'>
        <WeeklyTempSpreadGraph title={"Temperature Trend This Week"} weatherData={weatherData} graphWidth={400} graphHeight={200} chartTop={105} chartLeft={95}></WeeklyTempSpreadGraph>
      </WeatherCard>

      <WeatherCard width='630px' height='500px'>
        {/* TODO: don't hardcode day here, determine based on hook or something */}
        <TempVHumidityGraph title={`Humidity and Temperature (${weatherData.day1.dayOfWeek} ${weatherData.day1.date})`} hourlyWeather={weatherData.day1.hourlyWeather} graphWidth={400} graphHeight={200} chartTop={105} chartLeft={145}></TempVHumidityGraph>

        <p style={{ paddingTop: '337px'}}>TODO:</p>
        <p>- add arrows somewhere, like carosoul</p>
        <p>- arrows can go from one day to the next to view each day's graph</p>
        <p>- also show icon for overall weather of day (?)</p>
      </WeatherCard>

      <Box
        sx={(theme) => ({
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
