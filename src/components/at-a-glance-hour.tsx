import { Box, Typography, useTheme } from '@mui/material';
import type { WeatherCodeInfo } from '../types/weather-types';
import { getWeatherIcon } from '../utils/get-weather-icon';

type AtAGlanceHourProps = {
  weatherCodeInfo: WeatherCodeInfo;
  isDay: boolean;
  temperature: number;
  time: string;
};

const AtAGlanceHour = ({ weatherCodeInfo, isDay, temperature, time }: AtAGlanceHourProps) => {
  const theme = useTheme();
  const { svg, svgAlt } = getWeatherIcon(weatherCodeInfo, isDay);

  return (
    <Box
      sx={{
        border: `1px solid ${theme.palette.cardBg.light}`,
        background: theme.palette.bg.main,
        borderRadius: '8px',
        width: 72,
        height: 160,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '16px',
        boxSizing: 'border-box',
        textAlign: 'center',
      }}
    >
      <Typography sx={{ fontSize: '20px', fontWeight: 700 }}>{Math.round(temperature)}°</Typography>

      <img
        src={svg}
        alt={svgAlt}
        width={55}
        height={55}
        style={{ objectFit: 'contain', margin: '-15px 0 -10px 0' }}
      />
      
      <Typography sx={{ fontSize: '13px', fontWeight: 500 }}>{time.replace(/:00\s/, ' ')}</Typography>
    </Box>
  );
};

export default AtAGlanceHour;