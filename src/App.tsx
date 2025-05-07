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

  const humidityCurrentDay = weatherData.day1.hourlyWeather.map((hourly, i) => ({
    x: i,
    y: hourly.humidity,
  }));

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
      </WeatherCard>

      <WeatherCard>
        <CurvyTimeGraph id="day-temp-2" data={temperaturesCurrentDay} gradientstops={[theme.palette.pink.light, theme.palette.pink.main]} type="area"/>
        <CurvyTimeGraph id="day-temp" data={temperaturesCurrentDay} gradientstops={[theme.palette.teal.main, theme.palette.blue.main]} type="area"/>
        <CurvyTimeGraph id="day-humidity" data={humidityCurrentDay} gradientstops={[theme.palette.purple.main, theme.palette.pink.main]} gradientDirection='h' type="area"/>
      </WeatherCard>

      <WeatherCard width='400px' height='500px'>
        <CurvyTimeGraph id="dashed" style={{ position: "absolute", top: '45px' }} data={humidityCurrentDay} range={[0, 100]} gradientstops={[theme.palette.pink.main, "white"]} gradientDirection='h' type="dashed-line"/>
        <CurvyTimeGraph id="line" style={{ position: "absolute", top: '45px' }} data={temperaturesCurrentDay} gradientstops={[theme.palette.teal.main, theme.palette.purple.main]} gradientDirection='h' type="line-area"/>

        <p style={{ paddingTop: '200px'}}>Daily Humidity and Temperature</p>
        <p>TODO:</p>
        <p>- add labels to lines on graph</p>
        <p>- add x and y axis labels and background lines</p>
        <p>- add label with date at top of card, with arrows somewhere, like carosoul</p>
        <p>- arrows can go from one day to the next to view each day's humidity and temperature graph</p>
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
