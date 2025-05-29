
import sunsetSvg from '../../assets/weather-icons/sunset.svg';
import sunriseSvg from '../../assets/weather-icons/sunrise.svg';
import type { TimeToTwilight } from '../../types/weather-types';
import { Box, useTheme } from '@mui/material';
import TwilightCountdown from './twilight-countdown';
import TwilightTimes from './twilight-times';
import WeatherCard from '../../components/weather-card';

type TwilightCardProps = {
  timeToSunset: TimeToTwilight;
  timeToSunrise: TimeToTwilight;
  sunrise: string;
  sunset: string;
};

const TwilightCard: React.FC<TwilightCardProps> = ({ timeToSunset, timeToSunrise, sunrise, sunset }) => {
  const theme = useTheme();

  return (
    <WeatherCard width='500px' height='317px' sx={{ paddingTop: '25px' }}>
      <Box display='flex' flexDirection='column' gap={3}>

        <Box display='flex' flexDirection='row' justifyContent='space-evenly' alignItems='flex-end' gap={2}>
          <TwilightTimes 
            icon={sunsetSvg} 
            iconAlt='sunset icon' 
            label={`SUNSET - ${sunset}`}/>

          <TwilightTimes 
            icon={sunriseSvg} 
            iconAlt='sunrise icon' 
            label={`SUNRISE - ${sunrise}`}/>
        </Box>

        <Box display='flex' flexDirection='column' gap={4} sx={{ marginTop: '30px' }}>
          <TwilightCountdown 
            id='sunset_countdown' 
            timeToTwilight={timeToSunset} 
            gradientstops={[theme.palette.blue.main, theme.palette.pink.main]}/>

          <TwilightCountdown 
            id='sunrise_countdown' 
            timeToTwilight={timeToSunrise} 
            gradientstops={[theme.palette.teal.main, theme.palette.purple.main]}/>
        </Box>
      </Box>
    </WeatherCard>
  );
};

export default TwilightCard;
