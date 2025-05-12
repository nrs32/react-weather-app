import { useTheme } from '@mui/material/styles';
import { useQuery } from '@tanstack/react-query'

import reactLogo from './assets/react.svg'
import openMedeoLogo from './assets/open-medeo.png'
import viteLogo from '/vite.svg'
import './App.scss';
import { getWeather } from './services/weather-service'
import WeatherCard from './components/weather-card'
import GradientCircularProgress from './components/gradient-circular-progress'
import type { DayIndex, WeatherData } from './types/weather-types';
import Box from '@mui/material/Box';
import RawDataModal from './components/raw-data-modal';
import WeeklyTempSpreadGraph from './components/graphs/weekly-temp-spread-graph';
import TempVHumidityGraph from './components/graphs/temp-v-humidity-graph';
import CarouselControls from './components/carousel-controls';
import { useState } from 'react';
import WeatherCodeDisplay from './components/weather-code-display';
import CurrentTempDisplay from './components/current-temp-display';

function App() {
  const theme = useTheme();
  const { dayIndex, hasPrev, hasNext, onNext, onPrev } = useTempVHumidDayIndex();

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

      <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
        <WeatherCard sx={{ fontWeight: 700, textAlign: 'center', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 5 }}>
          <CurrentTempDisplay actualTemp={weatherData.current.temperature} feelsLike={weatherData.current.apparentTemperature}></CurrentTempDisplay>
        </WeatherCard>

        <WeatherCard sx={{ fontWeight: 700, textAlign: 'center', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 5 }}>
          <WeatherCodeDisplay isDay={weatherData.current.isDay} weatherCodeInfo={weatherData.current.weatherCodeInfo}></WeatherCodeDisplay>
        </WeatherCard>

        <WeatherCard>
          <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 4, alignItems: 'center', height: '100%' }}>
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
          </Box>
        </WeatherCard>

        <WeatherCard width='738px' height='340px' sx={{ paddingLeft: '0', paddingRight: '5px'}}>
          <CarouselControls
            onPrev={onPrev}
            onNext={onNext}
            prevLabel={hasPrev ? weatherData[`day${(dayIndex - 1) as DayIndex}`].dayOfWeek : undefined}
            nextLabel={hasNext ? weatherData[`day${(dayIndex + 1) as DayIndex}`].dayOfWeek : undefined}
            hasPrev={hasPrev}
            hasNext={hasNext}
          >
            <TempVHumidityGraph title={`Humidity and Temperature (${weatherData[`day${dayIndex}`].dayOfWeek} ${weatherData[`day${dayIndex}`].date})`} hourlyWeather={weatherData[`day${dayIndex}`].hourlyWeather} graphWidth={400} graphHeight={200} chartTop={7} chartLeft={0}></TempVHumidityGraph>
          </CarouselControls>
        </WeatherCard>

        <WeatherCard width='580px' height='340px'>
          <WeeklyTempSpreadGraph title={"Temperature Trend This Week"} weatherData={weatherData} graphWidth={400} graphHeight={200} chartTop={7} chartLeft={0}></WeeklyTempSpreadGraph>
        </WeatherCard>

        {/* TODO: maybe current weather stuff can be toggled in daily weather carousel like the TempVHumidity graph (e.g. weather code, hihg, low, humidity, etc) */}
        {/* TODO: time to sunset/sunrise  */}
      </Box>

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

function useTempVHumidDayIndex() {
  const [dayIndex, setDayIndex] = useState<DayIndex>(1);

  const hasPrev = dayIndex > 1;
  const hasNext = dayIndex < 7;

  const onNext = () => {
    if (hasNext) setDayIndex(prev => (prev + 1) as DayIndex);
  };

  const onPrev = () => {
    if (hasPrev) setDayIndex(prev => (prev - 1) as DayIndex);
  };

  return { dayIndex, hasPrev, hasNext, onNext, onPrev };
}

export default App
