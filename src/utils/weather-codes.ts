// WMO Weather Codes modifed from
// https://open-meteo.com/en/docs?current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code&hourly=temperature_2m,weather_code&latitude=42.88&longitude=85.81#weather_variable_documentation

const weatherCodes: {
  [key: number]: {
    desc: string;
    dayIcon: string;
    nightIcon: string;
  };
} = {
  0: { desc: 'Clear Sky', dayIcon: 'clear-day', nightIcon: 'clear-night' },
  1: { desc: 'Mainly clear', dayIcon: 'clear-day', nightIcon: 'clear-night' },
  2: { desc: 'Partly cloudy', dayIcon: 'partly-cloudy-day', nightIcon: 'partly-cloudy-night' },
  3: { desc: 'Overcast', dayIcon: 'overcast', nightIcon: 'overcast' },
  45: { desc: 'Foggy', dayIcon: 'fog-day', nightIcon: 'fog-night' },
  48: { desc: 'Foggy', dayIcon: 'fog-day', nightIcon: 'fog-night' },
  51: { desc: 'Light Drizzle', dayIcon: 'partly-cloudy-day-drizzle', nightIcon: 'partly-cloudy-night-drizzle' },
  53: { desc: 'Moderate Drizzle', dayIcon: 'partly-cloudy-day-drizzle', nightIcon: 'partly-cloudy-night-drizzle' },
  55: { desc: 'Dense Drizzle', dayIcon: 'partly-cloudy-day-drizzle', nightIcon: 'partly-cloudy-night-drizzle' },
  56: { desc: 'Light Sleet', dayIcon: 'partly-cloudy-day-sleet', nightIcon: 'partly-cloudy-night-sleet' },
  57: { desc: 'Heavy Sleet', dayIcon: 'partly-cloudy-day-sleet', nightIcon: 'partly-cloudy-night-sleet' },
  61: { desc: 'Light Rain', dayIcon: 'partly-cloudy-day-rain', nightIcon: 'partly-cloudy-night-rain' },
  63: { desc: 'Moderate Rain', dayIcon: 'partly-cloudy-day-rain', nightIcon: 'partly-cloudy-night-rain' },
  65: { desc: 'Heavy Rain', dayIcon: 'extreme-day-rain', nightIcon: 'extreme-night-rain' },
  66: { desc: 'Freezing Rain (light)', dayIcon: 'partly-cloudy-day-sleet', nightIcon: 'partly-cloudy-night-sleet' },
  67: { desc: 'Freezing Rain (heavy)', dayIcon: 'partly-cloudy-day-sleet', nightIcon: 'partly-cloudy-night-sleet' },
  71: { desc: 'Light Snowfall', dayIcon: 'partly-cloudy-day-snow', nightIcon: 'partly-cloudy-night-snow' },
  73: { desc: 'Moderate Snowfall', dayIcon: 'partly-cloudy-day-snow', nightIcon: 'partly-cloudy-night-snow' },
  75: { desc: 'Heavy Snowfall', dayIcon: 'extreme-day-snow', nightIcon: 'extreme-night-snow' },
  77: { desc: 'Snow grains', dayIcon: 'partly-cloudy-day-snow', nightIcon: 'partly-cloudy-night-snow' },
  80: { desc: 'Mild Rain showers', dayIcon: 'partly-cloudy-day-rain', nightIcon: 'partly-cloudy-night-rain' },
  81: { desc: 'Moderate Rain showers', dayIcon: 'partly-cloudy-day-rain', nightIcon: 'partly-cloudy-night-rain' },
  82: { desc: 'Violent Rain showers', dayIcon: 'extreme-day-rain', nightIcon: 'extreme-night-rain' },
  85: { desc: 'Mild Snow showers', dayIcon: 'partly-cloudy-day-snow', nightIcon: 'partly-cloudy-night-snow' },
  86: { desc: 'Heavy Snow showers', dayIcon: 'extreme-day-snow', nightIcon: 'extreme-night-snow' },
  95: { desc: 'Thunderstorm', dayIcon: 'thunderstorms-day-rain', nightIcon: 'thunderstorms-night-rain' },
  96: { desc: 'Thunderstorm with slight hail', dayIcon: 'thunderstorms-day-rain', nightIcon: 'thunderstorms-night-rain' },
  99: { desc: 'Thunderstorm with heavy hail', dayIcon: 'thunderstorms-day-hail', nightIcon: 'thunderstorms-night-hail' },
};

export default weatherCodes;