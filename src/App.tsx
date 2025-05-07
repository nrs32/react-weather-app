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
import CurvyTimeGraph from './components/curvy-time-graph';


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

  // TODO: use hook and option for user to switch which days data they're viewing
  // Then recalc this based on selected day and display that data
  const temperaturesCurrentDay = weatherData.day1.hourlyWeather.map((hourly, i) => ({
    x: i,
    y: hourly.temperature,
  }));

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
      </WeatherCard>


      <WeatherCard>
        <CurvyTimeGraph id="line" data={temperaturesCurrentDay} gradientstops={[theme.palette.teal.main, theme.palette.purple.main]} type="line-area"/>
      </WeatherCard>

      <WeatherCard>
        <CurvyTimeGraph id="area" data={temperaturesCurrentDay} gradientstops={[theme.palette.teal.main, theme.palette.blue.main]} type="area"/>
      </WeatherCard>

      <WeatherCard>
        <CurvyTimeGraph id="dashed" data={temperaturesCurrentDay} gradientstops={[theme.palette.pink.main, "white"]} type="dashed-line"/>
      </WeatherCard>

      <WeatherCard>
        Raw Data:
        <pre className='raw-data'>{JSON.stringify(weatherData, null, 2)}</pre>
      </WeatherCard>

      <div className='tech-icons'>
        <a href="https://open-meteo.com" target="_blank">
          <img src={openMedeoLogo} width="30px" alt="Open-meteo logo" />
        </a>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} alt="React logo" />
        </a>
      </div>
    </>
  )
}

export default App
