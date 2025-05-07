import { WeatherApiResponse } from '@openmeteo/sdk/weather-api-response';
import type { DayKey, HourlyWeather, WeatherData } from '../types/weather-types';
import weatherCodes from './weather-codes';

const getWeatherDesc = (code: number): string => {
  return weatherCodes[code] || "Unknown";
}

const getTimeString = (date: Date): string => {
	return date.toLocaleTimeString([], {
		hour: 'numeric',
		minute: '2-digit',
		hour12: true
	});
}

const getTimeToSunset = (sunset: Date, currentTime: Date): string => {
	const diffMs = sunset.getTime() - currentTime.getTime();

	if (diffMs <= 0) return 'Sun has set';

	const totalMinutes = Math.floor(diffMs / 60000);
	const hours = Math.floor(totalMinutes / 60);
	const minutes = totalMinutes % 60;

	if (hours === 0) {
		return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
	}

	return `${hours} hour${hours !== 1 ? 's' : ''} & ${minutes} minute${minutes !== 1 ? 's' : ''}`;
}

const getTimeToSunrise = (sunrise: Date, currentTime: Date): string => {
	const diffMs = sunrise.getTime() - currentTime.getTime();

	if (diffMs <= 0) return 'Sun has risen';

	const totalMinutes = Math.floor(diffMs / 60000);
	const hours = Math.floor(totalMinutes / 60);
	const minutes = totalMinutes % 60;

	if (hours === 0) {
		return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
	}

	return `${hours} hour${hours !== 1 ? 's' : ''} & ${minutes} minute${minutes !== 1 ? 's' : ''}`;
}

const timeToMilitary = (time: string): number => {
  const match = time.match(/^(\d+):00 (AM|PM)$/i);
  if (!match) return -1;

	// Extract matches:
	// fullMatch (8:00 AM), firstGrpMatch (8), secondGroupMatch (AM)
  const [_, hourStr, period] = match;

  let hour = parseInt(hourStr, 10) % 12;
  if (period.toUpperCase() === 'PM') hour += 12;
  return hour;
};

const hourSort = (a: HourlyWeather, b: HourlyWeather) => {
	const aMilitary = timeToMilitary(a.time);
	const bMilitary = timeToMilitary(b.time);
	if (aMilitary < bMilitary) {
		return -1;

	} else if (aMilitary > bMilitary) {
		return 1;
	}

	return 0;
}

const sortHourlyData = (weatherData: WeatherData): WeatherData=> {
	weatherData.day1.hourlyWeather.sort(hourSort);
	weatherData.day2.hourlyWeather.sort(hourSort);
	weatherData.day3.hourlyWeather.sort(hourSort);
	weatherData.day4.hourlyWeather.sort(hourSort);
	weatherData.day5.hourlyWeather.sort(hourSort);
	weatherData.day6.hourlyWeather.sort(hourSort);
	weatherData.day7.hourlyWeather.sort(hourSort);

	return weatherData;
}

const getInitWeatherData = (response: WeatherApiResponse) => {
	// The code for this method is modifed from:
	// https://open-meteo.com/en/docs?current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code&hourly=temperature_2m,weather_code&latitude=42.88&longitude=85.81

	const utcOffsetSeconds = response.utcOffsetSeconds();
	const current = response.current()!;
	const hourly = response.hourly()!;
	const daily = response.daily()!;
	const sunrise = daily.variables(0)!;
	const sunset = daily.variables(1)!;

	// NOTE: The order of weather variables in the URL query and the indices below need to match!
	return {
		current: {
			time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
			temperature2m: current.variables(0)!.value(),
			relativeHumidity2m: current.variables(1)!.value(),
			apparentTemperature: current.variables(2)!.value(),
			isDay: current.variables(3)!.value(),
			precipitation: current.variables(4)!.value(),
			weatherCode: current.variables(5)!.value(),
		},
		hourly: {
			time: [...Array((Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval())].map(
				(_, i) => new Date((Number(hourly.time()) + i * hourly.interval() + utcOffsetSeconds) * 1000)
			),
			temperature2m: hourly.variables(0)!.valuesArray()!,
			weatherCode: hourly.variables(1)!.valuesArray()!,
		},
		daily: {
			time: [...Array((Number(daily.timeEnd()) - Number(daily.time())) / daily.interval())].map(
				(_, i) => new Date((Number(daily.time()) + i * daily.interval() + utcOffsetSeconds) * 1000)
			),
			sunrise: [...Array(sunrise.valuesInt64Length())].map(
				(_, i) => new Date((Number(sunrise.valuesInt64(i)) + utcOffsetSeconds) * 1000)
			),
			sunset: [...Array(sunset.valuesInt64Length())].map(
				(_, i) => new Date((Number(sunset.valuesInt64(i)) + utcOffsetSeconds) * 1000)
			),
		},
	};
}

const processWeatherData = (responses: WeatherApiResponse[]): WeatherData => {
	const initWeatherData = getInitWeatherData(responses[0]); // We only have 1 location, therefore 1 response
	const currentWeather = initWeatherData.current;

	// Partial here allows us to not declare the day keys when initializing the object
	const weatherData: Partial<WeatherData> = {
		current: {
			time: getTimeString(currentWeather.time),
			temperature: Math.round(currentWeather.temperature2m),
			humidity: currentWeather.relativeHumidity2m,
			apparentTemperature: Math.round(currentWeather.apparentTemperature),
			isDay: !!currentWeather.isDay,
			precipitation: currentWeather.precipitation,
			weatherDesc: getWeatherDesc(currentWeather.weatherCode),
			timeToSunset: getTimeToSunset(initWeatherData.daily.sunset[0], currentWeather.time),
			timeToSunrise: getTimeToSunrise(initWeatherData.daily.sunrise[0], currentWeather.time),
		},
	};

	const hourlyTimes = initWeatherData.hourly.time;
	let dayIndex = 1;
	let currentDateKey =  hourlyTimes[0].toISOString().split('T')[0];
	for (let i = 0; i < hourlyTimes.length; i++) {
		const baseDate = hourlyTimes[i];
		const dateKey = baseDate.toISOString().split('T')[0];
		const isNextDay = dateKey !== currentDateKey;
		const isFirstDay = i == 0;

		if (isNextDay) {
      dayIndex++;
      currentDateKey = dateKey;
    }

		if (isNextDay || isFirstDay) {
			const sunset = initWeatherData.daily.sunset[dayIndex - 1];
			const sunrise = initWeatherData.daily.sunrise[dayIndex - 1];

			weatherData[`day${dayIndex}` as DayKey] = {
				date: `${baseDate.getMonth() + 1}/${baseDate.getDate()}`,
				dayOfWeek: baseDate.toLocaleDateString('en-US', { weekday: 'short' }),
				sunset: getTimeString(sunset),
				sunrise: getTimeString(sunrise),
				hourlyWeather: [],
			}
		}

		weatherData[`day${dayIndex}` as DayKey]!.hourlyWeather.push({
			time: getTimeString(baseDate),
			temperature: Math.round(initWeatherData.hourly.temperature2m[i]),
			weatherDesc: getWeatherDesc(initWeatherData.hourly.weatherCode[i])
		});
	}

	const finalWeatherData = sortHourlyData(weatherData as WeatherData);

	return finalWeatherData;
}

export default processWeatherData;