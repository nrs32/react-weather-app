import { WeatherApiResponse } from '@openmeteo/sdk/weather-api-response';
import type { DayKey, TimeToTwilight, WeatherCodeInfo, WeatherData } from '../types/weather-types';
import weatherCodes from './weather-codes';

const getWeatherCodeInfo = (code: number): WeatherCodeInfo => {
  return weatherCodes[code] || "Unknown";
}

const getTimeString = (date: Date): string => {
	return date.toLocaleTimeString([], {
		hour: 'numeric',
		minute: '2-digit',
		hour12: true
	});
}

const getTimeToSunset = (sunset: Date, currentTime: Date): TimeToTwilight => {
	const diffMs = sunset.getTime() - currentTime.getTime();

	if (diffMs <= 0) return {
		label: 'Sun has set',
		percent: 100,
	};
	
	const timeToTwilight = getTimeToTwilight(diffMs);
	return {...timeToTwilight, label: `${timeToTwilight.label} to sunset`};
}

const getTimeToSunrise = (sunrise: Date, currentTime: Date): TimeToTwilight => {
	const diffMs = sunrise.getTime() - currentTime.getTime();

	if (diffMs <= 0) return {
		label: 'Sun has risen',
		percent: 100,
	};

	const timeToTwilight = getTimeToTwilight(diffMs);
	return {...timeToTwilight, label: `${timeToTwilight.label} to sunrise`};
}

const getTimeToTwilight = (diffMs: number): TimeToTwilight => {
	const totalMinutes = Math.floor(diffMs / 60000);
	const hours = Math.floor(totalMinutes / 60);
	const minutes = totalMinutes % 60;

	const hoursRemaining = Math.round(totalMinutes / 60);
	const percentTimeRemaining = ((12 - hoursRemaining) / 12) * 100

	if (hours === 0) {
		return {
			label:  `${minutes} minute${minutes !== 1 ? 's' : ''}`,
			percent: percentTimeRemaining,
		};
	}

	return {
		label: `${hours} hour${hours !== 1 ? 's' : ''} & ${minutes} minute${minutes !== 1 ? 's' : ''}`,
		percent: percentTimeRemaining,
	};
}

const getInitWeatherData = (response: WeatherApiResponse) => {
	// The code for this method is modifed from:
	// https://open-meteo.com/en/docs?current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code&hourly=temperature_2m,weather_code&latitude=42.88&longitude=85.81

	// NOTE: open-medeo uses utcOffsetSeconds paired with toISO, but I don't want to use that for conversion
	// utcOffsetSeconds by itself, with no toISO time, makes the dates incorrect, so I removed this part of the time calculations
	const utcOffsetSeconds = response.utcOffsetSeconds();
	const current = response.current()!;
	const hourly = response.hourly()!;
	const daily = response.daily()!;
	const sunrise = daily.variables(0)!;
	const sunset = daily.variables(1)!;

	// NOTE: The order of weather variables in the URL query and the indices below need to match!
	return {
		current: {
			time: new Date((Number(current.time())) * 1000),
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
				(_, i) => new Date((Number(hourly.time()) + i * hourly.interval()) * 1000)
			),
			temperature2m: hourly.variables(0)!.valuesArray()!,
			weatherCode: hourly.variables(1)!.valuesArray()!,
			relativeHumidity2m: hourly.variables(2)!.valuesArray()!,
			apparentTemperature: hourly.variables(3)!.valuesArray()!,
			isDay: hourly.variables(4)!.valuesArray()!,
		},
		daily: {
			time: [...Array((Number(daily.timeEnd()) - Number(daily.time())) / daily.interval())].map(
				(_, i) => new Date((Number(daily.time()) + i * daily.interval()) * 1000)
			),
			sunrise: [...Array(sunrise.valuesInt64Length())].map(
				(_, i) => new Date((Number(sunrise.valuesInt64(i))) * 1000)
			),
			sunset: [...Array(sunset.valuesInt64Length())].map(
				(_, i) => new Date((Number(sunset.valuesInt64(i))) * 1000)
			),
			temperature2mMax: daily.variables(2)!.valuesArray()!,
			temperature2mMin: daily.variables(3)!.valuesArray()!,
			uvIndexMax: daily.variables(4)!.valuesArray()!,
			weatherCode: daily.variables(5)!.valuesArray()!,
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
			precipitation: Math.round(currentWeather.precipitation),
			weatherCodeInfo: getWeatherCodeInfo(currentWeather.weatherCode),
			timeToSunset: getTimeToSunset(initWeatherData.daily.sunset[0], currentWeather.time),
			timeToSunrise: getTimeToSunrise(initWeatherData.daily.sunrise[0], currentWeather.time),
			cloudCover: currentWeather.cloudCover,
		},
	};

	const hourlyTimes = initWeatherData.hourly.time;
	let dayIndex = 1;
	const firstTime = hourlyTimes[0];
	let currentDateKey = hourlyTimes[0].toLocaleDateString('en-US');

	for (let i = 0; i < hourlyTimes.length; i++) {
		const baseDate = hourlyTimes[i];
		const dateKey = baseDate.toLocaleDateString('en-US');

		const isFirstHour = baseDate === firstTime;
		const isNextDay = dateKey !== currentDateKey;

		if (isNextDay) {
			dayIndex++;
			currentDateKey = dateKey;
		}

		if (isFirstHour || isNextDay) {
			const sunset = initWeatherData.daily.sunset[dayIndex - 1];
			const sunrise = initWeatherData.daily.sunrise[dayIndex - 1];
			const maxTemp = initWeatherData.daily.temperature2mMax[dayIndex - 1];
			const minTemp = initWeatherData.daily.temperature2mMin[dayIndex - 1];
			const avgTemp = (maxTemp + minTemp) / 2;

			weatherData[`day${dayIndex}` as DayKey] = {
				date: `${baseDate.getMonth() + 1}/${baseDate.getDate()}`,
				dayOfWeek: baseDate.toLocaleDateString('en-US', { weekday: 'short' }),
				sunset: getTimeString(sunset),
				sunrise: getTimeString(sunrise),
				hourlyWeather: [],
				uvIndex: initWeatherData.daily.uvIndexMax[dayIndex - 1],
				tempMax: maxTemp,
				tempMin: minTemp,
				tempAvg: avgTemp,
				weatherCodeInfo: getWeatherCodeInfo(initWeatherData.daily.weatherCode[dayIndex - 1]),
			};
		}

		weatherData[`day${dayIndex}` as DayKey]!.hourlyWeather.push({
			time: getTimeString(baseDate),
			temperature: Math.round(initWeatherData.hourly.temperature2m[i]),
			humidity: initWeatherData.hourly.relativeHumidity2m[i],
			apparentTemperature: Math.round(initWeatherData.hourly.apparentTemperature[i]),
			weatherCodeInfo: getWeatherCodeInfo(initWeatherData.hourly.weatherCode[i]),
			isDay: !!initWeatherData.hourly.isDay[i],
		});
	}

	return weatherData as WeatherData;
}

export default processWeatherData;