import { Box, useTheme } from '@mui/material';
import WeatherCard from '../components/weather-card';
import GradientCircularProgress from '../components/gradient-circular-progress';

type WeatherDialProps = {
  humidity: number;
  precipitation: number;
  cloudCover: number;
};

const WeatherDials = ({ humidity, precipitation, cloudCover }: WeatherDialProps) => {
  const theme = useTheme();

  return (
    <WeatherCard>
      <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 4, alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <GradientCircularProgress
          id="humidity"
          value={humidity}
          label={`${humidity}`}
          labelcolor={theme.palette.teal.main}
          labelsize={50}
          subtitle='Humidity'
          thickness={3.5}
          size={140}
          gradientstops={[theme.palette.teal.main, theme.palette.blue.main]}
        />
        <GradientCircularProgress
          id="precipitation"
          value={precipitation}
          label={`${precipitation}`}
          labelcolor={theme.palette.pink.main}
          labelsize={50}
          subtitle='Precip.'
          thickness={3.5}
          size={140}
          gradientstops={[theme.palette.purple.main, theme.palette.pink.main]}
        />
        <GradientCircularProgress
          id="cloud_cover"
          value={cloudCover}
          label={`${cloudCover}`}
          labelcolor={theme.palette.pink.light}
          labelsize={50}
          subtitle='Cloud Cover'
          thickness={3.5}
          size={140}
          gradientstops={[theme.palette.pink.main, "white"]}
        />
      </Box>
    </WeatherCard>
  );
};

export default WeatherDials;
