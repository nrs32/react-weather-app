export interface CurrentWeather {
  time: string; 				  // The current time
  temperature: number; 	  // Temperature at 2 meters above ground (Fahrenheit)
  humidity: number; 	 	  // Relative humidity at 2 meters above ground (%)
  apparentTemperature: number; // Apparent temperature (Fahrenheit)
  isDay: boolean; 			  // Whether it's daytime
  precipitation: number;  // Precipitation amount (mm)
  weatherCodeInfo: WeatherCodeInfo; // Weather code info
	timeToSunset: TimeToTwilight;
	timeToSunrise: TimeToTwilight;
  cloudCover: number;      // %
}

export interface TimeToTwilight {
  label: string;   // Time until sunset/sunrise (x hours & y minutes)
  percent: number; // % of time remaining to sunset/sunrise out of 12 hours
}

export interface HourlyWeather {
  time: string; 			 // The current time h:mm AM/PM
  temperature: number; // Temperature at 2 meters above ground (Fahrenheit)
  weatherCodeInfo: WeatherCodeInfo; // Weather code info
  humidity: number; 	 // Relative humidity at 2 meters above ground (%)
  apparentTemperature: number; // Apparent temperature (Fahrenheit)
}

export interface DayWeather {
	date: string; 		 // The date M/D
	dayOfWeek: string; // Weekday short
	sunset: string;    // The time h:mm AM/PM
	sunrise: string;   // The time h:mm AM/PM
  uvIndex: number;
  tempMax: number;
  tempMin: number;
  tempAvg: number;
  weatherCodeInfo: WeatherCodeInfo;
	hourlyWeather: HourlyWeather[];
}

export type DayIndex = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type DayKey = `day${DayIndex}`;

export const dayKeys: DayKey[] = Array.from({ length: 7 }, (_, i) => `day${i + 1}` as DayKey);

export interface WeatherData {
  current: CurrentWeather;
  day1: DayWeather;
	day2: DayWeather;
	day3: DayWeather;
	day4: DayWeather;
	day5: DayWeather;
	day6: DayWeather;
	day7: DayWeather;
}

export interface WeatherCodeInfo {
  desc: string;
  dayIcon: string;
  nightIcon: string;
}