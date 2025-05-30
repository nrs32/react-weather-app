import { useQuery } from '@tanstack/react-query'

import './App.scss';
import { getWeather } from './services/weather-service'
import WeatherCard from './components/weather-card'
import type { WeatherData } from './types/weather-types';
import Box from '@mui/material/Box';
import WeeklyTempSpreadGraph from './features/graphs/weekly-temp-spread-graph';
import { useEffect, useState } from 'react';
import WeatherCodeCard from './features/weather-code-card';
import CurrentTempCard from './features/current-temp-card';
import ThemedButton from './components/themed-button';
import TwilightCard from './features/twilight-card/twilight-card';
import FooterAttribution from './features/footer-attribution';
import TempVHumidityCarousel from './features/temp-v-humidity-carousel';
import WeatherAtAGlance from './features/weather-at-a-glance/weather-at-a-glance';
import WeatherDials from './features/weather-dials';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import LocationLoadingMap from './features/location-loading';
import WeatherLoading from './features/weather-loading/weather-loading';

gsap.registerPlugin(ScrollTrigger);

// TODO: refactoring and cleanup 

interface UserLocation {
  lat: number;
  long: number;
}

const REFRESH_INTERVAL: number = 300000; // miliseconds
const MIN_LOCATION_DELAY: number = 5000;
const MIN_WEATHER_DELAY: number = 10500;

function App() {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const minLocationDelayDone = useMinLoadingDelay(MIN_LOCATION_DELAY);
  const locationReady = (location || locationError) && minLocationDelayDone;

  const [startWeatherDelay, setStartWeatherDelay] = useState(false);
  const [weatherDelayHasStarted, setWeatherDelayHasStarted] = useState(false);
  const minWeatherLoadingDelayDone = useMinLoadingDelay(startWeatherDelay ? MIN_WEATHER_DELAY : 0);

  useEffect(() => {
    handleRefreshLocation();
  }, []);

  const handleRefreshLocation = () => {
    setLocation(null);
    setLocationError(null);
    setStartWeatherDelay(false);
    setWeatherDelayHasStarted(false);

    getUserLocation()
      .then(setLocation)
      .catch(setLocationError);
  }

  useEffect(() => {
    if (locationReady) {
      setStartWeatherDelay(true);
      setWeatherDelayHasStarted(true); 
    }
  }, [locationReady]);

  const handleRefetchWeatherData = () => {
    setStartWeatherDelay(false); 
    setWeatherDelayHasStarted(false);

    setTimeout(() => {
      refetchWeatherData();
      setStartWeatherDelay(true); 
      setWeatherDelayHasStarted(true);
    }, 300);
  }

  const { isPending, isError: isWeatherError, data, error: weatherError, refetch: refetchWeatherData } = useQuery({
    // queryKey is a unique key to cache results from this call
    // e.g. controller name, route, and any params you pass the call
    queryKey: location ? ['weather', location.lat, location.long] : ['weather'],
    queryFn: () => getWeather(location!.lat, location!.long),
    enabled: !!location, // This query will not run until location has a value
    refetchInterval: REFRESH_INTERVAL, // refetch data every miliseconds
  });

  if (!locationReady) {
    return <LocationLoadingMap/>
  }
  
  if (isPending || !minWeatherLoadingDelayDone || !weatherDelayHasStarted) {
    return <WeatherLoading/>
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
      <ThemedButton onClick={handleRefetchWeatherData} label='Refresh Weather (Auto is 5 Min)'/>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginBottom: "100px" }}>
        <CurrentTempCard actualTemp={weatherData.current.temperature} feelsLike={weatherData.current.apparentTemperature}></CurrentTempCard>
        <WeatherCodeCard isDay={weatherData.current.isDay} weatherCodeInfo={weatherData.current.weatherCodeInfo}></WeatherCodeCard>
        
        <WeatherDials 
          humidity={weatherData.current.humidity} 
          precipitation={weatherData.current.precipitation} 
          cloudCover={weatherData.current.cloudCover}/>

        <TwilightCard 
          timeToSunrise={weatherData.current.timeToSunrise} 
          timeToSunset={weatherData.current.timeToSunset}
          sunrise={weatherData.day1.sunrise}
          sunset={weatherData.day1.sunset}/>

        <WeatherAtAGlance weatherData={weatherData}/>

        <TempVHumidityCarousel weatherData={weatherData}/>

        <WeatherCard width='580px' height='340px'>
          <WeeklyTempSpreadGraph title={"Temperature Trend This Week"} weatherData={weatherData} graphWidth={400} graphHeight={200} chartTop={7} chartLeft={0}></WeeklyTempSpreadGraph>
        </WeatherCard>
      </Box>

      <FooterAttribution weatherData={weatherData}/>
    </>
  )
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

function useMinLoadingDelay(minDelayMs: number) {
  const [delayDone, setDelayDone] = useState(true);

  useEffect(() => {
      setDelayDone(false);

      const timer = setTimeout(() => {
        setDelayDone(true);
      }, minDelayMs);

      return () => clearTimeout(timer);
    
  }, [minDelayMs]);

  return delayDone;
}

export default App
