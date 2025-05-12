import { Box, useTheme } from '@mui/material';
import type { WeatherCodeInfo } from '../types/weather-types';

type WeatherCodeDisplayProps = {
    weatherCodeInfo: WeatherCodeInfo;
    isDay: boolean;
};

const WeatherCodeDisplay = ({ weatherCodeInfo, isDay }: WeatherCodeDisplayProps) => {
  const theme = useTheme();

  const icons = import.meta.glob('../assets/weather-icons/*.svg', { eager: true, query: '?url', import: 'default' });
  const iconPaths = Object.entries(icons) as [string, string][];

  let svg: string = '';
  let svgAlt: string = '';

  if (isDay) {
    svg = iconPaths.find(([path]) => path.endsWith(`${weatherCodeInfo.dayIcon}.svg`))![1];
    svgAlt = weatherCodeInfo.dayIcon;

  } else {
    svg = iconPaths.find(([path]) => path.endsWith(`${weatherCodeInfo.nightIcon}.svg`))![1];
    svgAlt = weatherCodeInfo.nightIcon;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '180px'}}>
      <Box sx={{ marginTop: '-15px' }}>
        <img
          src={svg}
          alt={svgAlt}
          width={140}
          height={140}
          style={{ objectFit: 'contain' }}
          />
      </Box>
      <Box sx={{ fontSize: '20px', letterSpacing: theme.palette.text.secondaryLetterSpacing}}>
          {weatherCodeInfo.desc.toUpperCase()}
      </Box>
    </Box>
  );
};

export default WeatherCodeDisplay;
