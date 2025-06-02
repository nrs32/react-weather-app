import type { DayKey } from '../../types/weather-types';
import WeeklyWeather from './weekly-weather';
import HourlyWeather from './hourly-weather';
import WeatherCard from '../../components/weather-card';
import { useContext, useState } from 'react';
import { WeatherContext } from '../../App';

const WeatherAtAGlance = () => {
  const weatherData = useContext(WeatherContext)!;
  const [dayOfHourlyWeather, setDayOfHourlyWeather] = useState<DayKey>('day1');

  return (
    <WeatherCard width='580px' height='533px'>
      <WeeklyWeather dayClicked={setDayOfHourlyWeather} selectedDay={dayOfHourlyWeather}/>
      <HourlyWeather dayOfWeek={weatherData[dayOfHourlyWeather].dayOfWeek} date={weatherData[dayOfHourlyWeather].date} hourlyWeather={weatherData[dayOfHourlyWeather].hourlyWeather}></HourlyWeather>
    </WeatherCard>
  );
};

export default WeatherAtAGlance;


