import type { DayKey, WeatherData } from '../../types/weather-types';
import WeeklyWeather from './weekly-weather';
import HourlyWeather from './hourly-weather';
import { useState } from 'react';

type WeatherAtAGlanceProps = {
  weatherData: WeatherData;
};

const WeatherAtAGlance = ({ weatherData }: WeatherAtAGlanceProps) => {
  const [dayOfHourlyWeather, setDayOfHourlyWeather] = useState<DayKey>('day1');

  return (<>
    <WeeklyWeather weatherData={weatherData} dayClicked={setDayOfHourlyWeather} selectedDay={dayOfHourlyWeather}/>
    <HourlyWeather dayOfWeek={weatherData[dayOfHourlyWeather].dayOfWeek} date={weatherData[dayOfHourlyWeather].date} hourlyWeather={weatherData[dayOfHourlyWeather].hourlyWeather}></HourlyWeather>
  </>
  );
};

export default WeatherAtAGlance;


