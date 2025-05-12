import { fetchWeatherApi } from "openmeteo";
import processWeatherData from "../utils/process-weather-data";
import { fakeData } from "../assets/fake-data";

export async function getWeather(lat: number, long: number) {
  const useRealData: boolean = true;
  const url = "https://api.open-meteo.com/v1/forecast";

  const params = {
    "latitude": lat,
    "longitude": long,
    "temperature_unit": "fahrenheit",
    "precipitation_unit": "inch",
    "wind_speed_unit": "mph",
    "daily": ["sunrise", "sunset", "uv_index_max", "temperature_2m_max", "temperature_2m_min"],
    "timezone": "America/New_York",
    "hourly": ["temperature_2m", "weather_code", "relative_humidity_2m", "apparent_temperature"],
    "current": ["temperature_2m", "relative_humidity_2m", "apparent_temperature", "is_day", "precipitation", "weather_code", "cloud_cover"]
  };

  if (useRealData) {
    return await fetchWeatherApi(url, params)
      .then(processWeatherData)
      .catch((error) => {
        console.error(error);
      });

  } else {
    return new Promise(resolve => {
      resolve(fakeData);
    });
  }
}