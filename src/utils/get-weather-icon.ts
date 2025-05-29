import type { WeatherCodeInfo } from '../types/weather-types';

const icons = import.meta.glob('../assets/weather-icons/*.svg', { eager: true, query: '?url', import: 'default' });
const iconPaths = Object.entries(icons) as [string, string][];

export function getWeatherIcon(weatherCodeInfo: WeatherCodeInfo, isDay: boolean): { svg: string; svgAlt: string } {
  let svg: string = '';
  let svgAlt: string = '';

  if (isDay) {
    svg = iconPaths.find(([path]) => path.endsWith(`${weatherCodeInfo.dayIcon}.svg`))![1];
    svgAlt = weatherCodeInfo.dayIcon;

  } else {
    svg = iconPaths.find(([path]) => path.endsWith(`${weatherCodeInfo.nightIcon}.svg`))![1];
    svgAlt = weatherCodeInfo.nightIcon;
  }

  return { svg, svgAlt };
}
