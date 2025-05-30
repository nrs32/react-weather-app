import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getWeather } from '../../services/weather-service';
import LocationLoadingMap from '../../features/location-loading';
import WeatherLoading from '../../features/weather-loading/weather-loading';
import type { WeatherData } from '../../types/weather-types';

const REFRESH_INTERVAL = 300000;
const MIN_LOCATION_DELAY = 5000;
const MIN_WEATHER_DELAY = 10500;

interface UserLocation {
  lat: number;
  long: number;
}

export function useAppLoading() {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const minLocationDelayDone = useMinLoadingDelay(MIN_LOCATION_DELAY);
  const locationReady = (location || locationError) && minLocationDelayDone;

  const [startWeatherDelay, setStartWeatherDelay] = useState(false);
  const [weatherDelayStarted, setWeatherDelayStarted] = useState(false);
  const minWeatherLoadingDelayDone = useMinLoadingDelay(startWeatherDelay ? MIN_WEATHER_DELAY : 0);

  useEffect(() => {
    refreshLocation();
  }, []);

  useEffect(() => {
    if (locationReady) {
      setStartWeatherDelay(true);
      setWeatherDelayStarted(true);
    }
  }, [locationReady]);

  const refreshLocation = () => {
    setLocation(null);
    setLocationError(null);
    setStartWeatherDelay(false);
    setWeatherDelayStarted(false);

    getUserLocation().then(setLocation).catch(setLocationError);
  };

  const {
    isPending,
    isError,
    data,
    error,
    refetch: refetchWeatherData,
  } = useQuery({
    queryKey: location ? ['weather', location.lat, location.long] : ['weather'],
    queryFn: () => getWeather(location!.lat, location!.long),
    enabled: !!location,
    refetchInterval: REFRESH_INTERVAL,
  });

  const handleRefetchWeatherData = () => {
    setStartWeatherDelay(false);
    setWeatherDelayStarted(false);

    setTimeout(() => {
      refetchWeatherData();
      setStartWeatherDelay(true);
      setWeatherDelayStarted(true);
    }, 300);
  };

  if (!locationReady) {
    return {
      isLoading: true,
      loadingScreen: <LocationLoadingMap />,
    };
  }

  if (isPending || !minWeatherLoadingDelayDone || !weatherDelayStarted) {
    return {
      isLoading: true,
      loadingScreen: <WeatherLoading />,
    };
  }

  if (isError || locationError != null) {
    return {
      isLoading: false,
      error: error?.message || locationError,
    };
  }

  return {
    isLoading: false,
    loadingScreen: null,
    error: null,
    data: data as WeatherData,
    refreshLocation,
    refetchWeatherData: handleRefetchWeatherData,
  };
}

function useMinLoadingDelay(minDelayMs: number) {
  const [delayDone, setDelayDone] = useState(true);

  useEffect(() => {
    setDelayDone(false);
    const timer = setTimeout(() => setDelayDone(true), minDelayMs);
    return () => clearTimeout(timer);
  }, [minDelayMs]);

  return delayDone;
}

function getUserLocation(): Promise<UserLocation> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      return reject('Geolocation is not supported by your browser.');
    }

    navigator.geolocation.getCurrentPosition(
      (position) =>
        resolve({
          lat: position.coords.latitude,
          long: position.coords.longitude,
        }),
      () => reject('Unable to retrieve location. Permission denied or unavailable.')
    );
  });
}