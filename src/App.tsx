import { useTheme } from '@mui/material/styles';
import { useQuery } from '@tanstack/react-query'

import './App.scss';
import { getWeather } from './services/weather-service'
import WeatherCard from './components/weather-card'
import GradientCircularProgress from './components/gradient-circular-progress'
import type { DayIndex, WeatherData } from './types/weather-types';
import Box from '@mui/material/Box';
import WeeklyTempSpreadGraph from './components/graphs/weekly-temp-spread-graph';
import TempVHumidityGraph from './components/graphs/temp-v-humidity-graph';
import CarouselControls from './components/carousel-controls';
import { useEffect, useState } from 'react';
import WeatherCodeDisplay from './components/weather-code-display';
import CurrentTempDisplay from './components/current-temp-display';
import ThemedButton from './components/themed-button';
import TwilightDisplay from './components/twilight-display/twilight-display';
import FooterAttribution from './components/footer-attribution';

// TODO: Show daily weather code with min and max temps 
// TODO: Considar clicking on day and showing houlry weather code with temps
//
// TODO: do something cool for loading.
// TODO: gsap text split use with loading text for location/weather data? and force the text to show for at least 1 animation cycle
// TODO: implememt smooth scroll with gsap? Maybe different speed scrolls / stagger too?
// TODO: animation graph svgs to draw themselves. Probs cant use gsap svg bc of area, 
//       but can use gsap to animate slow reveal of svg underneath or something?

interface UserLocation {
  lat: number;
  long: number;
}

const REFRESH_INTERVAL: number = 300000; // miliseconds

function App() {
  const theme = useTheme();
  const { dayIndex, hasPrev, hasNext, onNext, onPrev } = useTempVHumidDayIndex();
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    handleRefreshLocation();
  }, []);

  const handleRefreshLocation = () => {
    setLocation(null);
    setLocationError(null);

    getUserLocation()
      .then(setLocation)
      .catch(setLocationError);
  }

  const { isPending, isError: isWeatherError, data, error: weatherError, refetch: refetchWeatherData } = useQuery({
    // queryKey is a unique key to cache results from this call
    // e.g. controller name, route, and any params you pass the call
    queryKey: location ? ['weather', location.lat, location.long] : ['weather'],
    queryFn: () => getWeather(location!.lat, location!.long),
    enabled: !!location, // This query will not run until location has a value
    refetchInterval: REFRESH_INTERVAL, // refetch data every miliseconds
  });

  // TODO: Make loading nice and handle this better
  if (!location && !locationError) {
    return <span>Loading Location...</span>
  }
  
  if (isPending) {
    return <span>Loading Weather Data...</span>
  }

  if (isWeatherError || locationError != null) {
    return <span>Error: {weatherError?.message || locationError}</span>
  }

  const weatherData = data as WeatherData;
  
  return (
    <>
     <h1 className='heading'> Weather Dashboard </h1>
     
     <Box sx={{ position: 'absolute', right: '15px', top: '22px', display: 'flex', flexDirection: 'column', gap: 1 }}>
      <ThemedButton onClick={handleRefreshLocation} label='Refresh Location'/>
      <ThemedButton onClick={refetchWeatherData} label='Refresh Weather (Auto is 5 Min)'/>
     </Box>

      <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginBottom: "100px" }}>
        <WeatherCard sx={{ fontWeight: 700, textAlign: 'center', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 5 }}>
          <CurrentTempDisplay actualTemp={weatherData.current.temperature} feelsLike={weatherData.current.apparentTemperature}></CurrentTempDisplay>
        </WeatherCard>

        <WeatherCard sx={{ fontWeight: 700, textAlign: 'center', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 5 }}>
          <WeatherCodeDisplay isDay={weatherData.current.isDay} weatherCodeInfo={weatherData.current.weatherCodeInfo}></WeatherCodeDisplay>
        </WeatherCard>

        <WeatherCard>
          <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 4, alignItems: 'center', justifyContent: 'center', height: '100%' }}>
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

        <WeatherCard width='500px' height='317px' sx={{ paddingTop: '25px' }}>
          <TwilightDisplay 
            timeToSunrise={weatherData.current.timeToSunrise} 
            timeToSunset={weatherData.current.timeToSunset}
            sunrise={weatherData.day1.sunrise}
            sunset={weatherData.day1.sunset}/>
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
      </Box>

      <FooterAttribution weatherData={weatherData}/>
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

function getUserLocation(): Promise<UserLocation> {
    return new Promise((resolve, reject) => {

    if (!navigator.geolocation) {
      return reject('Geolocation is not supported by your browser.');
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          long: position.coords.longitude,
        });
      },
      (err) => {
        reject('Unable to retrieve location. Permission denied or unavailable.');
      }
    );
  });
}

export default App
