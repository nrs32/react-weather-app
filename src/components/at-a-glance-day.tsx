import { Box, Typography, useTheme } from '@mui/material';
import type { WeatherCodeInfo } from '../types/weather-types';
import LoopingConveyerText from './looping-conveyer-text';
import { getWeatherIcon } from '../utils/get-weather-icon';

type AtAGlanceDayProps = {
  weatherCodeInfo: WeatherCodeInfo;
  isDay: boolean;
  date: string;
  dayOfWeek: string;
  tempMax: number;
  tempMin: number;
};

const AtAGlanceDay = ({ weatherCodeInfo, isDay, date, dayOfWeek, tempMax, tempMin }: AtAGlanceDayProps) => {
  const theme = useTheme();
  const WIDTH = 150;
  const PADDING = 16;

  const { svg, svgAlt } = getWeatherIcon(weatherCodeInfo, isDay);

  return (
    <Box
      sx={{
        border: `3px solid ${theme.palette.bg.main}`,
        background: theme.palette.bg.main,
        borderRadius: '8px',
        width: WIDTH,
        height: 250,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: `${PADDING}px`,
        boxSizing: 'border-box',
        textAlign: 'center',

        '&:hover': {
          border: `3px solid ${theme.palette.lightGrey.main}`,
          cursor: 'pointer',
        }
      }}
    >
      <Typography sx={{ fontSize: '20px', fontWeight: 700 }}>{dayOfWeek}</Typography>
      <Typography sx={{ fontSize: '17px', fontWeight: 700, marginTop: '-6px' }}>{date}</Typography>

      <img
        src={svg}
        alt={svgAlt}
        width={95}
        height={95}
        style={{ objectFit: 'contain', marginTop: '-15px' }}
      />
      <Box title={weatherCodeInfo.desc.toUpperCase()} sx={{ overflow: 'hidden', width: '100%', marginTop: '-12px' }}>
        <LoopingConveyerText text={weatherCodeInfo.desc.toUpperCase()} containerWidth={WIDTH - (PADDING*2)}/>
      </Box>
      <Typography variant="h6">{Math.round(tempMax)}° / {Math.round(tempMin)}</Typography>
    </Box>
  );
};

export default AtAGlanceDay;


