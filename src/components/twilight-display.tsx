
import sunsetSvg from '../assets/weather-icons/sunset.svg';
import sunriseSvg from '../assets/weather-icons/sunrise.svg';
import GradientLinearProgress from './gradient-linear-progress';
import type { TimeToTwilight } from '../types/weather-types';
import { Box, Typography, useTheme } from '@mui/material';

type TwilightDisplayProps = {
  timeToSunset: TimeToTwilight;
  timeToSunrise: TimeToTwilight;
  sunrise: string;
  sunset: string;
};

const TwilightDisplay: React.FC<TwilightDisplayProps> = ({ timeToSunset, timeToSunrise, sunrise, sunset }) => {
  const theme = useTheme();

  const twilightTimeLabelStyles: React.CSSProperties = { 
    color: theme.palette.text.primary, 
    fontSize: '18px', 
    fontWeight: 700, 
    letterSpacing: theme.palette.text.secondaryLetterSpacing
  };

  const countdownLabelStyles: React.CSSProperties = { 
    color: theme.palette.text.primary, 
    paddingBottom: '9px',
    marginTop: '-13px', 
    textTransform: 'capitalize',
    textAlign: 'right',
    fontSize: '14px',
    fontWeight: 700,
    letterSpacing: theme.palette.text.secondaryLetterSpacing,
  };

  const twilightIconSize = 140;

  return (
    <Box display='flex' flexDirection='column' gap={3}>

      <Box display='flex' flexDirection='row' justifyContent='space-evenly' alignItems='flex-end' gap={2}>
        <Box display='flex' flexDirection='column' alignItems='center'>
          <img src={sunsetSvg} alt="Sunset" width={twilightIconSize} height={twilightIconSize} />
          <Typography sx={{...twilightTimeLabelStyles, marginTop: '-15px' }}>SUNSET - {sunset}</Typography>
        </Box>

        <Box display='flex' flexDirection='column' alignItems='center'>
          <img src={sunriseSvg} alt="Sunrise" width={twilightIconSize} height={twilightIconSize} />
          <Typography sx={{...twilightTimeLabelStyles, marginTop: '-17px' }}>SUNRISE - {sunrise}</Typography>
        </Box>
      </Box>

      <Box display='flex' flexDirection='column' gap={3} sx={{ marginTop: '25px' }}>

        <Box display='flex' flexDirection='row' sx={{ padding: '10px 0'}} gap={1}>
          <Box display='flex' flexDirection='column' flex={1}>
            <Typography sx={countdownLabelStyles}>{timeToSunset.label}</Typography>
            <GradientLinearProgress
              id="sunset_countdown"
              value={timeToSunset.percent}
              gradientstops={[theme.palette.blue.main, theme.palette.pink.main]}
            />
          </Box>
        </Box>

        <Box display='flex' flexDirection='row' sx={{ padding: '10px 0'}} gap={1}>
          <Box display='flex' flexDirection='column' flex={1} >
            <Typography sx={countdownLabelStyles}>{timeToSunrise.label}</Typography>
            <GradientLinearProgress
              id="sunrise_countdown"
              value={timeToSunrise.percent}
              gradientstops={[theme.palette.teal.main, theme.palette.purple.main]}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default TwilightDisplay;
