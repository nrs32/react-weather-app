import { Box, useTheme } from '@mui/material';
import type { WeatherCodeInfo } from '../types/weather-types';
import { getWeatherIcon } from '../utils/get-weather-icon';
import WeatherCard from '../components/weather-card';

type WeatherCodeCardProps = {
    weatherCodeInfo: WeatherCodeInfo;
    isDay: boolean;
};

const WeatherCodeCard = ({ weatherCodeInfo, isDay }: WeatherCodeCardProps) => {
  const theme = useTheme();

  const { svg, svgAlt } = getWeatherIcon(weatherCodeInfo, isDay);

  return (
    <WeatherCard sx={{ fontWeight: 700, textAlign: 'center', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 5 }}>
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
    </WeatherCard>
  );
};

export default WeatherCodeCard;
