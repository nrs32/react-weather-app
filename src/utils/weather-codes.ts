// WMO Weather Codes modifed from
// https://open-meteo.com/en/docs?current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code&hourly=temperature_2m,weather_code&latitude=42.88&longitude=85.81#weather_variable_documentation

const weatherCodes: { [key: number]: string } = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Foggy',
  48: 'Foggy',
  51: 'Light Drizzle',
  53: 'Moderate Drizzle',
  55: 'Dense Drizzle',
  56: 'Freezing Drizzle (light)',
  57: 'Freezing Drizzle (heavy)',
  61: 'Light Rain',
  63: 'Moderate Rain',
  65: 'Heavy Rain',
  66: 'Freezing Rain (light)',
  67: 'Freezing Rain (heavy)',
  71: 'Light Snowfall',
  73: 'Moderate Snowfall',
  75: 'Heavy Snowfall',
  77: 'Snow grains',

  // Rain showers are short bursts of rain, vs rain which is more constant
  80: 'Mild Rain showers',
  81: 'Moderate Rain showers',
  82: 'Violent Rain showers',
  85: 'Mild Snow showers',
  86: 'Heavy Snow showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with slight hail',
  99: 'Thunderstorm with heavy hail',
};

export default weatherCodes;