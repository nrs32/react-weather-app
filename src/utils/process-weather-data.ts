import { WeatherApiResponse } from '@openmeteo/sdk/weather-api-response';
import type { DayKey, WeatherData } from '../types/weather-types';
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
			cloudCover: current.variables(6)!.value(),
		},
		hourly: {
			time: [...Array((Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval())].map(
				(_, i) => new Date((Number(hourly.time()) + i * hourly.interval() + utcOffsetSeconds) * 1000)
			),
			temperature2m: hourly.variables(0)!.valuesArray()!,
			weatherCode: hourly.variables(1)!.valuesArray()!,
			relativeHumidity2m: hourly.variables(2)!.valuesArray()!,
			apparentTemperature: hourly.variables(3)!.valuesArray()!,
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
			uvIndexMax: daily.variables(2)!.valuesArray()!,
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
			cloudCover: currentWeather.cloudCover,
		},
	};

	const hourlyTimes = initWeatherData.hourly.time;
	let dayIndex = 0;
	let currentDateKey = hourlyTimes[0].toLocaleDateString('en-US');
	const yesterdaysDateKey = new Date(Date.now() - 86400000).toLocaleDateString('en-US');
	for (let i = 0; i < hourlyTimes.length; i++) {
		const baseDate = hourlyTimes[i];
		const dateKey = baseDate.toLocaleDateString('en-US');

		if (dateKey === yesterdaysDateKey) {
			// NOTE: Our data starts with yesterday bc of UTC data from open-meteo
			// So we skip yesterdays data when mapping to days
			// This also means the isNextDay will be true for our first data of today
			continue;
		}

		const isNextDay = dateKey !== currentDateKey;

		if (isNextDay) {
      dayIndex++;
      currentDateKey = dateKey;
    }

		if (isNextDay) {
			const sunset = initWeatherData.daily.sunset[dayIndex - 1];
			const sunrise = initWeatherData.daily.sunrise[dayIndex - 1];

			weatherData[`day${dayIndex}` as DayKey] = {
				date: `${baseDate.getMonth() + 1}/${baseDate.getDate()}`,
				dayOfWeek: baseDate.toLocaleDateString('en-US', { weekday: 'short' }),
				sunset: getTimeString(sunset),
				sunrise: getTimeString(sunrise),
				hourlyWeather: [],
				uvIndex: initWeatherData.daily.uvIndexMax[dayIndex - 1],
			};
		}

		weatherData[`day${dayIndex}` as DayKey]!.hourlyWeather.push({
			time: getTimeString(baseDate),
			temperature: Math.round(initWeatherData.hourly.temperature2m[i]),
			humidity: initWeatherData.hourly.relativeHumidity2m[i],
			apparentTemperature: Math.round(initWeatherData.hourly.apparentTemperature[i]),
			weatherDesc: getWeatherDesc(initWeatherData.hourly.weatherCode[i]),
		});
	}

	return weatherData as WeatherData;
}

export default processWeatherData;