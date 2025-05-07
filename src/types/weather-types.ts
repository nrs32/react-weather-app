export interface CurrentWeather {
  time: string; 				  // The current time
  temperature: number; 	  // Temperature at 2 meters above ground (Fahrenheit)
  humidity: number; 	 	  // Relative humidity at 2 meters above ground (%)
  apparentTemperature: number; // Apparent temperature (Fahrenheit)
  isDay: boolean; 			  // Whether it's daytime
  precipitation: number;  // Precipitation amount (mm)
  weatherDesc: string;    // Weather code desc
	timeToSunset: string;   // Time until sunset  (x hours & y minutes)
	timeToSunrise: string;	// Time until sunrise (x hours & y minutes)
  cloudCover: number;     // %
}

export interface HourlyWeather {
  time: string; 			 // The current time h:mm AM/PM
  temperature: number; // Temperature at 2 meters above ground (Fahrenheit)
  weatherDesc: string; // Weather code desc
}

export interface DayWeather {
	date: string; 		 // The date M/D
	dayOfWeek: string; // Weekday short
	sunset: string;    // The time h:mm AM/PM
	sunrise: string;   // The time h:mm AM/PM
  uvIndex: number;
	hourlyWeather: HourlyWeather[];
}

export type DayKey = `day${1 | 2 | 3 | 4 | 5 | 6 | 7}`;

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